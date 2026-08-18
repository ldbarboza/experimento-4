import React from 'react'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { ContactForm } from '../ContactForm'
import * as contactApi from '../../api/contact'

vi.mock('../../api/contact')

describe('ContactForm', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('should render form with all required fields', () => {
    render(<ContactForm />)
    expect(screen.getByLabelText(/name/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/email/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/message/i)).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /send/i })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /clear/i })).toBeInTheDocument()
  })

  it('should show validation errors on blur with invalid input', async () => {
    render(<ContactForm />)
    const nameInput = screen.getByLabelText(/name/i)

    fireEvent.change(nameInput, { target: { value: 'A' } })
    fireEvent.blur(nameInput)

    await waitFor(() => {
      expect(screen.getByText(/name must be at least 2 characters/i)).toBeInTheDocument()
    })
  })

  it('should disable submit button when form has errors', async () => {
    render(<ContactForm />)
    const submitButton = screen.getByRole('button', { name: /send/i })

    expect(submitButton).not.toBeDisabled()

    const nameInput = screen.getByLabelText(/name/i)
    fireEvent.change(nameInput, { target: { value: 'A' } })
    fireEvent.blur(nameInput)

    await waitFor(() => {
      expect(submitButton).toBeDisabled()
    })
  })

  it('should submit valid form', async () => {
    const mockSubmit = vi.fn().mockResolvedValue({
      success: true,
      submissionId: '123',
    })
    vi.mocked(contactApi.submitContact).mockImplementation(mockSubmit)

    render(<ContactForm />)

    const nameInput = screen.getByLabelText(/name/i)
    const emailInput = screen.getByLabelText(/email/i)
    const messageInput = screen.getByLabelText(/message/i)
    const submitButton = screen.getByRole('button', { name: /send/i })

    await userEvent.type(nameInput, 'John Doe')
    await userEvent.type(emailInput, 'john@example.com')
    await userEvent.type(messageInput, 'This is a test message')

    fireEvent.click(submitButton)

    await waitFor(() => {
      expect(mockSubmit).toHaveBeenCalledWith({
        name: 'John Doe',
        email: 'john@example.com',
        message: 'This is a test message',
      })
    })
  })

  it('should show success message on successful submission', async () => {
    vi.mocked(contactApi.submitContact).mockResolvedValue({
      success: true,
      submissionId: '123',
    })

    render(<ContactForm />)

    const nameInput = screen.getByLabelText(/name/i)
    const emailInput = screen.getByLabelText(/email/i)
    const messageInput = screen.getByLabelText(/message/i)
    const submitButton = screen.getByRole('button', { name: /send/i })

    await userEvent.type(nameInput, 'John Doe')
    await userEvent.type(emailInput, 'john@example.com')
    await userEvent.type(messageInput, 'This is a test message')

    fireEvent.click(submitButton)

    await waitFor(() => {
      expect(screen.getByText(/thank you for your message/i)).toBeInTheDocument()
    })
  })

  it('should clear form after successful submission', async () => {
    vi.mocked(contactApi.submitContact).mockResolvedValue({
      success: true,
      submissionId: '123',
    })

    render(<ContactForm />)

    const nameInput = screen.getByLabelText(/name/i) as HTMLInputElement
    const emailInput = screen.getByLabelText(/email/i) as HTMLInputElement
    const messageInput = screen.getByLabelText(/message/i) as HTMLTextAreaElement
    const submitButton = screen.getByRole('button', { name: /send/i })

    await userEvent.type(nameInput, 'John Doe')
    await userEvent.type(emailInput, 'john@example.com')
    await userEvent.type(messageInput, 'This is a test message')

    fireEvent.click(submitButton)

    await waitFor(() => {
      expect(nameInput.value).toBe('')
      expect(emailInput.value).toBe('')
      expect(messageInput.value).toBe('')
    })
  })

  it('should show error message on network failure', async () => {
    vi.mocked(contactApi.submitContact).mockRejectedValue(new Error('network_error'))

    render(<ContactForm />)

    const nameInput = screen.getByLabelText(/name/i)
    const emailInput = screen.getByLabelText(/email/i)
    const messageInput = screen.getByLabelText(/message/i)
    const submitButton = screen.getByRole('button', { name: /send/i })

    await userEvent.type(nameInput, 'John Doe')
    await userEvent.type(emailInput, 'john@example.com')
    await userEvent.type(messageInput, 'This is a test message')

    fireEvent.click(submitButton)

    await waitFor(() => {
      expect(screen.getByText(/network error/i)).toBeInTheDocument()
    })
  })

  it('should show error message on server failure', async () => {
    vi.mocked(contactApi.submitContact).mockRejectedValue(new Error('server_error'))

    render(<ContactForm />)

    const nameInput = screen.getByLabelText(/name/i)
    const emailInput = screen.getByLabelText(/email/i)
    const messageInput = screen.getByLabelText(/message/i)
    const submitButton = screen.getByRole('button', { name: /send/i })

    await userEvent.type(nameInput, 'John Doe')
    await userEvent.type(emailInput, 'john@example.com')
    await userEvent.type(messageInput, 'This is a test message')

    fireEvent.click(submitButton)

    await waitFor(() => {
      expect(screen.getByText(/something went wrong/i)).toBeInTheDocument()
    })
  })

  it('should reset form on clear button click', async () => {
    render(<ContactForm />)

    const nameInput = screen.getByLabelText(/name/i) as HTMLInputElement
    const emailInput = screen.getByLabelText(/email/i) as HTMLInputElement
    const messageInput = screen.getByLabelText(/message/i) as HTMLTextAreaElement
    const clearButton = screen.getByRole('button', { name: /clear/i })

    await userEvent.type(nameInput, 'John Doe')
    await userEvent.type(emailInput, 'john@example.com')
    await userEvent.type(messageInput, 'This is a test message')

    expect(nameInput.value).toBe('John Doe')

    fireEvent.click(clearButton)

    expect(nameInput.value).toBe('')
    expect(emailInput.value).toBe('')
    expect(messageInput.value).toBe('')
  })
})
