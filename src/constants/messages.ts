export const VALIDATION_MESSAGES = {
  NAME_REQUIRED: 'Name is required',
  NAME_MIN_LENGTH: 'Name must be at least 2 characters',
  NAME_MAX_LENGTH: 'Name must not exceed 100 characters',
  NAME_INVALID: 'Name can only contain letters, spaces, hyphens, and apostrophes',
  EMAIL_REQUIRED: 'Email is required',
  EMAIL_INVALID: 'Please enter a valid email address',
  EMAIL_MAX_LENGTH: 'Email must not exceed 254 characters',
  MESSAGE_REQUIRED: 'Message is required',
  MESSAGE_MIN_LENGTH: 'Message must be at least 10 characters',
  MESSAGE_MAX_LENGTH: 'Message must not exceed 5000 characters',
}

export const FEEDBACK_MESSAGES = {
  SUCCESS: 'Thank you for your message. We\'ll be in touch soon.',
  SUBMIT_BUTTON: 'Send',
  RESET_BUTTON: 'Clear',
  SENDING: 'Sending...',
  RETRY: 'Retry',
  ERROR_NETWORK: 'Network error. Please check your connection and try again.',
  ERROR_SERVER: 'Something went wrong. Please try again later.',
}
