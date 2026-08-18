import { describe, it, expect } from 'vitest'
import {
  validateName,
  validateEmail,
  validateMessage,
  validateForm,
  isFormValid,
} from '../validation'
import { VALIDATION_MESSAGES } from '../../constants/messages'

describe('validateName', () => {
  it('should reject empty name', () => {
    expect(validateName('')).toBe(VALIDATION_MESSAGES.NAME_REQUIRED)
    expect(validateName('  ')).toBe(VALIDATION_MESSAGES.NAME_REQUIRED)
  })

  it('should reject name less than 2 characters', () => {
    expect(validateName('A')).toBe(VALIDATION_MESSAGES.NAME_MIN_LENGTH)
  })

  it('should reject name exceeding 100 characters', () => {
    const longName = 'A'.repeat(101)
    expect(validateName(longName)).toBe(VALIDATION_MESSAGES.NAME_MAX_LENGTH)
  })

  it('should accept valid names', () => {
    expect(validateName('John Doe')).toBeUndefined()
    expect(validateName('Mary-Jane')).toBeUndefined()
    expect(validateName("O'Brien")).toBeUndefined()
  })

  it('should reject names with invalid characters', () => {
    expect(validateName('John123')).toBe(VALIDATION_MESSAGES.NAME_INVALID)
    expect(validateName('John@Doe')).toBe(VALIDATION_MESSAGES.NAME_INVALID)
  })
})

describe('validateEmail', () => {
  it('should reject empty email', () => {
    expect(validateEmail('')).toBe(VALIDATION_MESSAGES.EMAIL_REQUIRED)
    expect(validateEmail('  ')).toBe(VALIDATION_MESSAGES.EMAIL_REQUIRED)
  })

  it('should reject invalid email format', () => {
    expect(validateEmail('notanemail')).toBe(VALIDATION_MESSAGES.EMAIL_INVALID)
    expect(validateEmail('user@')).toBe(VALIDATION_MESSAGES.EMAIL_INVALID)
    expect(validateEmail('@example.com')).toBe(VALIDATION_MESSAGES.EMAIL_INVALID)
  })

  it('should reject email exceeding 254 characters', () => {
    const longEmail = `${'a'.repeat(245)}@example.com`
    expect(validateEmail(longEmail)).toBe(VALIDATION_MESSAGES.EMAIL_MAX_LENGTH)
  })

  it('should accept valid emails', () => {
    expect(validateEmail('user@example.com')).toBeUndefined()
    expect(validateEmail('john.doe+tag@example.co.uk')).toBeUndefined()
    expect(validateEmail('test123@test-domain.com')).toBeUndefined()
  })
})

describe('validateMessage', () => {
  it('should reject empty message', () => {
    expect(validateMessage('')).toBe(VALIDATION_MESSAGES.MESSAGE_REQUIRED)
    expect(validateMessage('  ')).toBe(VALIDATION_MESSAGES.MESSAGE_REQUIRED)
  })

  it('should reject message less than 10 characters', () => {
    expect(validateMessage('short')).toBe(VALIDATION_MESSAGES.MESSAGE_MIN_LENGTH)
    expect(validateMessage('123456789')).toBe(VALIDATION_MESSAGES.MESSAGE_MIN_LENGTH)
  })

  it('should reject message exceeding 5000 characters', () => {
    const longMessage = 'A'.repeat(5001)
    expect(validateMessage(longMessage)).toBe(VALIDATION_MESSAGES.MESSAGE_MAX_LENGTH)
  })

  it('should accept valid messages', () => {
    expect(validateMessage('This is a valid message!')).toBeUndefined()
    expect(validateMessage('A'.repeat(5000))).toBeUndefined()
  })
})

describe('validateForm', () => {
  it('should validate all fields', () => {
    const errors = validateForm({
      name: '',
      email: 'invalid',
      message: 'short',
    })
    expect(errors.name).toBe(VALIDATION_MESSAGES.NAME_REQUIRED)
    expect(errors.email).toBe(VALIDATION_MESSAGES.EMAIL_INVALID)
    expect(errors.message).toBe(VALIDATION_MESSAGES.MESSAGE_MIN_LENGTH)
  })

  it('should return no errors for valid data', () => {
    const errors = validateForm({
      name: 'John Doe',
      email: 'john@example.com',
      message: 'This is a valid message',
    })
    expect(errors.name).toBeUndefined()
    expect(errors.email).toBeUndefined()
    expect(errors.message).toBeUndefined()
  })
})

describe('isFormValid', () => {
  it('should return true when no errors', () => {
    expect(isFormValid({})).toBe(true)
  })

  it('should return false when any error exists', () => {
    expect(isFormValid({ name: 'Error' })).toBe(false)
    expect(isFormValid({ email: 'Error', message: 'Another error' })).toBe(false)
  })
})
