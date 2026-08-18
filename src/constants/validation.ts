export const VALIDATION_RULES = {
  NAME: {
    minLength: 2,
    maxLength: 100,
    pattern: /^[a-zA-Z\s\-']+$/,
  },
  EMAIL: {
    maxLength: 254,
    pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  },
  MESSAGE: {
    minLength: 10,
    maxLength: 5000,
  },
}

export const API_ENDPOINT = '/api/contact'
