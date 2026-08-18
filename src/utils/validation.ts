import { VALIDATION_RULES } from '../constants/validation'
import { VALIDATION_MESSAGES } from '../constants/messages'
import type { ContactFormData, ValidationErrors } from '../types/contact'

export function validateName(name: string): string | undefined {
  if (!name.trim()) {
    return VALIDATION_MESSAGES.NAME_REQUIRED
  }
  if (name.length < VALIDATION_RULES.NAME.minLength) {
    return VALIDATION_MESSAGES.NAME_MIN_LENGTH
  }
  if (name.length > VALIDATION_RULES.NAME.maxLength) {
    return VALIDATION_MESSAGES.NAME_MAX_LENGTH
  }
  if (!VALIDATION_RULES.NAME.pattern.test(name)) {
    return VALIDATION_MESSAGES.NAME_INVALID
  }
  return undefined
}

export function validateEmail(email: string): string | undefined {
  if (!email.trim()) {
    return VALIDATION_MESSAGES.EMAIL_REQUIRED
  }
  if (email.length > VALIDATION_RULES.EMAIL.maxLength) {
    return VALIDATION_MESSAGES.EMAIL_MAX_LENGTH
  }
  if (!VALIDATION_RULES.EMAIL.pattern.test(email)) {
    return VALIDATION_MESSAGES.EMAIL_INVALID
  }
  return undefined
}

export function validateMessage(message: string): string | undefined {
  if (!message.trim()) {
    return VALIDATION_MESSAGES.MESSAGE_REQUIRED
  }
  if (message.length < VALIDATION_RULES.MESSAGE.minLength) {
    return VALIDATION_MESSAGES.MESSAGE_MIN_LENGTH
  }
  if (message.length > VALIDATION_RULES.MESSAGE.maxLength) {
    return VALIDATION_MESSAGES.MESSAGE_MAX_LENGTH
  }
  return undefined
}

export function validateForm(data: ContactFormData): ValidationErrors {
  return {
    name: validateName(data.name),
    email: validateEmail(data.email),
    message: validateMessage(data.message),
  }
}

export function isFormValid(errors: ValidationErrors): boolean {
  return !errors.name && !errors.email && !errors.message
}
