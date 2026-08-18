import { Router, Request, Response } from 'express'
import { validateForm } from '../../src/utils/validation'
import type { ContactFormData, ApiResponse } from '../../src/types/contact'

const router = Router()

interface ContactRequest extends Request {
  body: Partial<ContactFormData>
}

// Rate limiting in-memory store (for demo; use Redis in production)
const submissionTracker: Record<string, number[]> = {}

function checkRateLimit(ip: string): boolean {
  const now = Date.now()
  const oneMinuteAgo = now - 60000
  const oneDayAgo = now - 86400000

  if (!submissionTracker[ip]) {
    submissionTracker[ip] = []
  }

  const timestamps = submissionTracker[ip]

  // Clean old entries
  submissionTracker[ip] = timestamps.filter(t => t > oneDayAgo)

  // Check per-minute limit (1 per minute)
  const recentSubmissions = submissionTracker[ip].filter(t => t > oneMinuteAgo)
  if (recentSubmissions.length >= 1) {
    return false
  }

  // Check per-day limit (5 per day)
  if (submissionTracker[ip].length >= 5) {
    return false
  }

  return true
}

router.post('/contact', async (req: ContactRequest, res: Response<ApiResponse>) => {
  try {
    const { name, email, message } = req.body
    const clientIp = (req.headers['x-forwarded-for'] as string)?.split(',')[0] || req.socket.remoteAddress || 'unknown'

    // Rate limiting check
    if (!checkRateLimit(clientIp)) {
      return res.status(429).json({
        success: false,
        message: 'Too many submissions. Please try again later.',
      })
    }

    // Validate input
    const errors = validateForm({
      name: String(name || ''),
      email: String(email || ''),
      message: String(message || ''),
    })

    if (errors.name || errors.email || errors.message) {
      return res.status(400).json({
        success: false,
        errors,
      })
    }

    // Sanitization: trim and escape HTML special characters
    const sanitize = (str: string): string => {
      return str
        .trim()
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#x27;')
    }

    const sanitizedData = {
      name: sanitize(name),
      email: sanitize(email),
      message: sanitize(message),
      submittedAt: new Date().toISOString(),
      submissionId: `contact-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      clientIp: clientIp.substring(0, 10), // Log partial IP for privacy
    }

    // TODO: Store in database or send email notification
    // For now, log to console in development
    console.log('Contact form submission:', sanitizedData)

    // Record successful submission
    submissionTracker[clientIp].push(Date.now())

    return res.status(200).json({
      success: true,
      message: 'Your message has been received. We will get back to you soon.',
      submissionId: sanitizedData.submissionId,
    })
  } catch (error) {
    console.error('Contact form error:', error)
    return res.status(500).json({
      success: false,
      message: 'An unexpected error occurred. Please try again later.',
    })
  }
})

export default router
