import { API_ENDPOINT } from '../constants/validation'
import type { ContactFormData, ApiResponse } from '../types/contact'

export async function submitContact(data: ContactFormData): Promise<ApiResponse> {
  const response = await fetch(API_ENDPOINT, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  })

  if (!response.ok) {
    if (response.status >= 500) {
      throw new Error('server_error')
    }
    if (response.status === 400) {
      const errorData = await response.json()
      throw new Error(JSON.stringify(errorData))
    }
    throw new Error('unknown_error')
  }

  return response.json()
}
