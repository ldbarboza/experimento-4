import { describe, it, expect, vi, beforeEach } from 'vitest'
import { renderHook, act } from '@testing-library/react'
import { useContactForm } from '../useContactForm'
import * as contactApi from '../../api/contact'

vi.mock('../../api/contact')

describe('useContactForm', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('should initialize with empty form state', () => {
    const { result } = renderHook(() => useContactForm())

    expect(result.current.values).toEqual({
      name: '',
      email: '',
      message: '',
    })
    expect(result.current.errors).toEqual({})
    expect(result.current.touched).toEqual({})
    expect(result.current.isSubmitting).toBe(false)
    expect(result.current.isSuccess).toBe(false)
  })

  it('should update form values on change', () => {
    const { result } = renderHook(() => useContactForm())

    act(() => {
      result.current.handleChange({
        target: { name: 'name', value: 'John Doe' },
      } as any)
    })

    expect(result.current.values.name).toBe('John Doe')
  })

  it('should validate on blur', () => {
    const { result } = renderHook(() => useContactForm())

    act(() => {
      result.current.handleChange({
        target: { name: 'name', value: 'A' },
      } as any)
    })

    act(() => {
      result.current.handleBlur({
        target: { name: 'name' },
      } as any)
    })

    expect(result.current.errors.name).toBeDefined()
    expect(result.current.touched.name).toBe(true)
  })

  it('should handle successful submission', async () => {
    vi.mocked(contactApi.submitContact).mockResolvedValue({
      success: true,
      submissionId: '123',
    })

    const { result } = renderHook(() => useContactForm())

    act(() => {
      result.current.handleChange({
        target: { name: 'name', value: 'John Doe' },
      } as any)
      result.current.handleChange({
        target: { name: 'email', value: 'john@example.com' },
      } as any)
      result.current.handleChange({
        target: { name: 'message', value: 'This is a test message' },
      } as any)
    })

    await act(async () => {
      await result.current.handleSubmit({
        preventDefault: () => {},
      } as any)
    })

    expect(result.current.isSuccess).toBe(true)
    expect(result.current.values).toEqual({
      name: '',
      email: '',
      message: '',
    })
  })

  it('should handle submission error', async () => {
    vi.mocked(contactApi.submitContact).mockRejectedValue(new Error('network_error'))

    const { result } = renderHook(() => useContactForm())

    act(() => {
      result.current.handleChange({
        target: { name: 'name', value: 'John Doe' },
      } as any)
      result.current.handleChange({
        target: { name: 'email', value: 'john@example.com' },
      } as any)
      result.current.handleChange({
        target: { name: 'message', value: 'This is a test message' },
      } as any)
    })

    await act(async () => {
      await result.current.handleSubmit({
        preventDefault: () => {},
      } as any)
    })

    expect(result.current.serverError).toBeDefined()
    expect(result.current.isSuccess).toBe(false)
  })

  it('should reset form on handleReset', () => {
    const { result } = renderHook(() => useContactForm())

    act(() => {
      result.current.handleChange({
        target: { name: 'name', value: 'John Doe' },
      } as any)
    })

    expect(result.current.values.name).toBe('John Doe')

    act(() => {
      result.current.handleReset()
    })

    expect(result.current.values).toEqual({
      name: '',
      email: '',
      message: '',
    })
    expect(result.current.errors).toEqual({})
    expect(result.current.touched).toEqual({})
  })

  it('should dismiss success message', () => {
    const { result } = renderHook(() => useContactForm())

    act(() => {
      // Manually set success state for testing
      result.current.handleChange({
        target: { name: 'name', value: 'John Doe' },
      } as any)
      result.current.handleChange({
        target: { name: 'email', value: 'john@example.com' },
      } as any)
      result.current.handleChange({
        target: { name: 'message', value: 'This is a test message' },
      } as any)
    })

    vi.mocked(contactApi.submitContact).mockResolvedValue({
      success: true,
    })

    act(() => {
      result.current.handleSubmit({
        preventDefault: () => {},
      } as any)
    })

    act(() => {
      result.current.dismissSuccess()
    })

    expect(result.current.isSuccess).toBe(false)
  })

  it('should validate form on submit', () => {
    const { result } = renderHook(() => useContactForm())

    act(() => {
      result.current.handleSubmit({
        preventDefault: () => {},
      } as any)
    })

    expect(result.current.errors.name).toBeDefined()
    expect(result.current.errors.email).toBeDefined()
    expect(result.current.errors.message).toBeDefined()
  })
})
