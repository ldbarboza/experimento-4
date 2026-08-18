# experimento-4 - Contact Form Feature

A modern, accessible contact form feature built with React and TypeScript.

## Features

- **Responsive Design**: Mobile-first CSS with responsive breakpoints (320px, 768px, 1024px+)
- **Client-Side Validation**: Real-time validation feedback on blur with inline error messages
- **Server-Side Validation**: Security boundary with parameterized queries and input sanitization
- **Accessibility First**: WCAG 2.1 AA compliant with semantic HTML and ARIA attributes
- **Progressive Enhancement**: Form works without JavaScript (HTML5 validation + server-side handling)
- **Error Recovery**: Network error handling with retry capability
- **Rate Limiting**: Basic server-side rate limiting (1 per minute per IP, 5 per day per email)
- **Comprehensive Testing**: Unit tests, component tests, and E2E tests with Playwright

## Tech Stack

**Frontend:**
- React 18+ with TypeScript
- Vite for fast development and optimized builds
- CSS Modules for scoped styling
- Vitest + React Testing Library for unit and component tests
- Playwright for E2E testing

**Backend:**
- Express.js for HTTP API
- TypeScript for type safety
- Built-in rate limiting and input sanitization

## Project Structure

```
.
├── src/
│   ├── components/          # React components
│   │   ├── ContactForm.tsx  # Main form component
│   │   ├── FormField.tsx    # Reusable input component
│   │   └── __tests__/       # Component tests
│   ├── pages/               # Page components
│   │   └── Contact.tsx      # Contact page
│   ├── hooks/               # Custom React hooks
│   │   ├── useContactForm.ts
│   │   └── __tests__/       # Hook tests
│   ├── api/                 # API integration
│   │   └── contact.ts       # API client
│   ├── utils/               # Utility functions
│   │   ├── validation.ts    # Validation logic
│   │   └── __tests__/       # Utility tests
│   ├── constants/           # Constants
│   │   ├── validation.ts    # Validation rules
│   │   └── messages.ts      # UI messages
│   ├── types/               # TypeScript types
│   │   └── contact.ts
│   ├── styles/              # CSS modules
│   │   └── ContactForm.module.css
│   ├── test/                # Test setup
│   │   └── setup.ts
│   ├── App.tsx              # Root component
│   └── main.tsx             # Entry point
├── backend/                 # Backend code
│   ├── server.ts            # Express server
│   └── routes/
│       └── contact.ts       # Contact route handler
├── e2e/                     # End-to-end tests
│   └── contact-form.spec.ts
├── index.html               # HTML entry point
├── package.json
├── tsconfig.json
├── vite.config.ts
├── vitest.config.ts
└── playwright.config.ts
```

## Installation

1. Install dependencies:
```bash
npm install
```

2. Start development server:
```bash
npm run dev
```

The app will be available at `http://localhost:5173`

## Development

### Start Dev Server
```bash
npm run dev
```

### Run Tests
```bash
# Unit and component tests
npm test

# Watch mode
npm test -- --watch

# Coverage report
npm test -- --coverage

# E2E tests (requires dev server running)
npm run test:e2e
```

### Build for Production
```bash
npm run build
npm run preview
```

## Form Validation

### Client-Side Validation (Real-time Feedback)

- **Name**: Required, 2-100 characters, letters/spaces/hyphens/apostrophes only
- **Email**: Required, valid email format, max 254 characters
- **Message**: Required, 10-5000 characters

### Server-Side Validation (Security Boundary)

All inputs are validated again on the server to ensure data quality and prevent malicious submissions. Additionally:
- HTML special characters are escaped to prevent XSS
- Parameterized queries prevent SQL injection
- Rate limiting prevents abuse

## API Endpoint

**POST /api/contact**

### Request
```json
{
  "name": "string",
  "email": "string",
  "message": "string"
}
```

### Response (Success - 200)
```json
{
  "success": true,
  "message": "Your message has been received. We will get back to you soon.",
  "submissionId": "contact-1234567890-abc123"
}
```

### Response (Validation Error - 400)
```json
{
  "success": false,
  "errors": {
    "name": "Name is required",
    "email": "Please enter a valid email address",
    "message": "Message must be at least 10 characters"
  }
}
```

### Response (Server Error - 500)
```json
{
  "success": false,
  "message": "An unexpected error occurred. Please try again later."
}
```

## Accessibility

The form is built with accessibility as a first-class concern:

- ✓ Semantic HTML (`<label>`, `<form>`, proper heading hierarchy)
- ✓ ARIA attributes (`aria-required`, `aria-describedby`)
- ✓ Error messages announced to screen readers (`role="alert"`)
- ✓ Keyboard navigation (Tab key navigation order)
- ✓ Focus indicators (visible outline on interactive elements)
- ✓ Required field indicators (asterisk)
- ✓ No reliance on color alone to convey errors
- ✓ Min 44px touch target size for buttons
- ✓ Min 16px font size for inputs
- ✓ Color contrast ≥4.5:1 for text

Test with screen readers (NVDA, JAWS, VoiceOver) to verify accessibility.

## Security

The form implements multiple layers of security:

1. **Client-Side Validation**: Provides UX feedback and catches obvious errors
2. **Server-Side Validation**: Authoritative validation boundary
3. **Input Sanitization**: Escapes HTML special characters
4. **Parameterized Queries**: Prevents SQL injection
5. **Rate Limiting**: Prevents abuse (1 per minute per IP, 5 per day per email)
6. **Generic Error Messages**: Never exposes sensitive data or stack traces
7. **HTTPS**: Form should always be served over HTTPS in production

## Development Checklist

Before deploying to production:

- [ ] Configure backend database for storing submissions
- [ ] Set up email notifications or webhook for form submissions
- [ ] Update API endpoint if different from `/api/contact`
- [ ] Test with screen readers (VoiceOver, NVDA, JAWS)
- [ ] Verify in all target browsers and devices
- [ ] Configure CORS if frontend and backend on different domains
- [ ] Set up SSL/TLS certificate for HTTPS
- [ ] Configure rate limiting for expected traffic
- [ ] Add CAPTCHA if spam is detected
- [ ] Set up analytics tracking
- [ ] Create admin dashboard for viewing/exporting submissions
- [ ] Update privacy policy to cover contact form data

## Performance

Current performance targets:
- Form loads in <1s
- Submission completes in <3s (typical network)
- 80%+ code coverage for form-related code
- Zero layout shifts (CLS = 0)

## License

MIT
