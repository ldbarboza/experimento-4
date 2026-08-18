# Architecture & Design

## Overview

This project implements a modern contact form with a focus on security, accessibility, and user experience. The architecture follows a separation of concerns principle with distinct frontend and backend components.

```
┌─────────────────────────────────────────────────────────┐
│                    Frontend (React + Vite)              │
├─────────────────────────────────────────────────────────┤
│  Components → Hooks → API Client → State Management    │
│                           ↓                             │
│                    Vite Dev Server                      │
│                    (Port 5173)                          │
└──────────────────────────┬──────────────────────────────┘
                           │
                        HTTP/JSON
                           │
                           ↓
┌──────────────────────────────────────────────────────────┐
│               Backend (Express + TypeScript)             │
├──────────────────────────────────────────────────────────┤
│  Routes → Middleware → Validation → Sanitization        │
│          → Rate Limiting → Storage                      │
└──────────────────────────────────────────────────────────┘
```

## Frontend Architecture

### Component Hierarchy

```
App
└── Contact (Page)
    └── ContactForm (Container)
        ├── SuccessMessage (Alert)
        ├── ErrorMessage (Alert)
        ├── FormField
        │   ├── Label
        │   ├── Input/Textarea
        │   └── ErrorMessage
        ├── FormField (repeated)
        └── ButtonGroup
            ├── SubmitButton
            └── ResetButton
```

### State Management

Uses a custom `useContactForm` hook to manage form state:

```typescript
{
  values: ContactFormData,      // Current form values
  errors: ValidationErrors,      // Field validation errors
  touched: Record<string, boolean>, // Which fields have been touched
  isSubmitting: boolean,        // API call in progress
  isSuccess: boolean,           // Submission was successful
  serverError?: string,         // Network/server error
}
```

**Design Decision:** Custom hook over Redux/Context because:
- Isolated form state, no global state needed
- Simpler to test and reason about
- Less boilerplate for a single form
- Can easily migrate to Redux if needed

### Validation Strategy

**Two-Layer Validation:**

1. **Client-Side (UX Layer)**
   - Real-time feedback on blur
   - Immediate error display
   - Disabled submit button when invalid
   - Improves perceived performance

2. **Server-Side (Security Boundary)**
   - Authoritative validation
   - Cannot be bypassed by disabling JS
   - Prevents malicious data submission
   - Returns field-level errors for UI mapping

**Shared Validation Logic:**
- Validation rules live in `src/constants/validation.ts`
- Validation functions in `src/utils/validation.ts`
- Can be imported and reused on server-side
- Source of truth for what constitutes valid data

### API Integration

Simple, error-aware API client:

```typescript
// src/api/contact.ts
export async function submitContact(data: ContactFormData): Promise<ApiResponse>
```

**Error Handling:**
- Network errors throw with `'network_error'` message
- Server errors (500+) throw with `'server_error'` message
- Validation errors (400) return structured error object
- Never exposes sensitive backend details

### Styling Approach

**CSS Modules** for scoped styling:
- No naming conflicts
- Explicit dependencies
- Easy to refactor
- Can adopt Tailwind later if needed

**Mobile-First Strategy:**
- Base styles for 320px+
- Progressive enhancement for larger screens
- Touch-friendly targets (min 44px)
- Readable font sizes (min 16px)

## Backend Architecture

### API Design

**Endpoint Structure:**
```
POST /api/contact
├── Request: JSON { name, email, message }
├── Response (200): { success: true, submissionId, message }
├── Response (400): { success: false, errors: { field: string } }
└── Response (500): { success: false, message: string }
```

**Design Decisions:**
- RESTful POST for state-changing operation
- Field-level errors for targeted UI feedback
- Generic error messages for security
- Includes submission ID for user reference

### Middleware Stack

```
Express App
├── cors() - Handle cross-origin requests
├── express.json() - Parse JSON bodies
├── /api/contact Route
│   ├── Rate Limiting Check
│   ├── Input Validation
│   ├── Input Sanitization
│   ├── Business Logic
│   └── Response Formatting
└── Error Handler - Catch unhandled errors
```

### Security Layers

1. **Rate Limiting**
   - 1 submission per minute per IP
   - 5 submissions per day per email
   - Prevents bulk abuse
   - Generic "too many requests" message

2. **Input Validation**
   - All inputs validated server-side
   - Type checking (strings)
   - Length constraints enforced
   - Format validation (email pattern)

3. **Input Sanitization**
   - HTML entities escaped (&, <, >, ", ')
   - Prevents XSS when data is rendered
   - Applied to all text inputs

4. **SQL Injection Prevention**
   - Parameterized queries (when using database)
   - Use ORM or prepared statements
   - Never concatenate SQL strings

5. **CSRF Protection**
   - Not needed for stateless REST API
   - Include CSRF tokens if adding cookies

### Data Flow

```
Request → Validation → Sanitization → Storage
                      ↓
                   Error?
                      ↓
                   Yes → Error Response
                      ↓
                   No → Continue → Success Response
```

## Testing Architecture

### Unit Tests (Vitest)

**Test Files:** `src/**/__tests__/*.test.ts`

**Coverage:**
- Validation functions
- Utility functions
- Hook logic

**Example:**
```typescript
describe('validateEmail', () => {
  it('should reject invalid email format', () => {
    expect(validateEmail('notanemail')).toBe(VALIDATION_MESSAGES.EMAIL_INVALID)
  })
})
```

### Component Tests (React Testing Library)

**Test Files:** `src/components/__tests__/*.test.tsx`

**Focus:**
- User interactions
- Error display
- State changes
- Accessibility attributes

**Example:**
```typescript
it('should show validation error on blur with invalid input', async () => {
  render(<ContactForm />)
  fireEvent.change(screen.getByLabel(/name/i), { target: { value: 'A' } })
  fireEvent.blur(screen.getByLabel(/name/i))
  await waitFor(() => {
    expect(screen.getByText(/name must be at least/i)).toBeInTheDocument()
  })
})
```

### E2E Tests (Playwright)

**Test Files:** `e2e/*.spec.ts`

**Focus:**
- Full user workflows
- Real browser interactions
- Cross-browser compatibility
- Accessibility verification

**Example:**
```typescript
test('should submit valid form successfully', async ({ page }) => {
  await page.goto('/')
  await page.getByLabel('Name').fill('John Doe')
  await page.getByRole('button', { name: /Send/i }).click()
  await expect(page.getByText(/thank you/i)).toBeVisible()
})
```

### Test Pyramid

```
    ╱╲
   ╱  ╲  E2E Tests (5-10%)
  ╱────╲
 ╱      ╲ Component Tests (30-40%)
╱────────╲
──────────  Unit Tests (50-60%)
```

**Rationale:**
- Many unit tests catch bugs early
- Moderate component tests verify integration
- Few E2E tests ensure critical paths work
- Faster feedback in development

## Data Models

### ContactFormData
```typescript
{
  name: string,      // 2-100 chars, alphanumeric + -'
  email: string,     // Valid email, max 254 chars
  message: string    // 10-5000 chars
}
```

### ValidationErrors
```typescript
{
  name?: string,     // Error message or undefined
  email?: string,
  message?: string
}
```

### ApiResponse
```typescript
{
  success: boolean,
  message?: string,         // User-facing message
  submissionId?: string,    // For reference
  errors?: Record<string, string>, // Field errors
  data?: unknown
}
```

## Performance Considerations

### Frontend

1. **Code Splitting:** Dynamic imports for route components
2. **Lazy Loading:** Images and heavy components
3. **Memoization:** React.memo for expensive components
4. **Bundle Size:** CSS Modules over Tailwind initially

### Backend

1. **Rate Limiting:** Prevents DOS attacks
2. **Input Validation:** Early rejection of bad data
3. **Error Handling:** No expensive operations on error
4. **Connection Pooling:** Reuse database connections

## Security Checklist

- [x] HTTPS required in production
- [x] Validation at both client and server
- [x] Input sanitization (HTML escaping)
- [x] SQL injection prevention (parameterized queries)
- [x] XSS prevention (escaping + React's defaults)
- [x] Rate limiting (1/min per IP, 5/day per email)
- [x] CSRF protection (not needed for stateless API)
- [x] Error message generalization (no PII exposure)
- [ ] CAPTCHA (future enhancement if spam detected)
- [ ] Secrets management (environment variables)
- [ ] CORS configuration (restrict origins)
- [ ] CSP headers (Content Security Policy)

## Accessibility Features

### Semantic HTML
- Proper form element structure
- Heading hierarchy maintained
- Label elements with `for` attributes

### ARIA Attributes
- `aria-required` on required fields
- `aria-describedby` linking errors to fields
- `role="alert"` for error messages

### Keyboard Navigation
- Tab order is logical
- No keyboard traps
- Focus visible on all interactive elements

### Screen Reader Support
- All text content readable
- Form structure clear
- Errors announced immediately

## Future Enhancements

### Phase 2
- [ ] Email notifications
- [ ] Submission tracking/analytics
- [ ] Admin dashboard
- [ ] CAPTCHA integration
- [ ] Honeypot field for spam

### Phase 3
- [ ] Multi-language support (i18n)
- [ ] File upload support
- [ ] Conditional fields
- [ ] Auto-save to localStorage
- [ ] OAuth integration

### Phase 4
- [ ] Machine learning spam detection
- [ ] Advanced admin features
- [ ] API rate limiting per user/API key
- [ ] Webhook integrations
- [ ] Export to CSV/PDF

## Deployment Architecture

```
┌──────────────────────┐
│   User's Browser     │
└──────────┬───────────┘
           │
      HTTPS (TLS 1.2+)
           │
    ┌──────▼────────┐
    │  CDN/Static   │
    │  (React App)  │
    └──────┬────────┘
           │
      HTTPS (TLS 1.2+)
           │
    ┌──────▼─────────────────┐
    │   API Load Balancer    │
    │   (Multiple Instances) │
    └──────┬────────┬────────┘
           │        │
      ┌────▼─┐  ┌───▼────┐
      │ API  │  │ API    │
      │ Pod1 │  │ Pod2   │
      └────┬─┘  └───┬────┘
           │        │
      ┌────▼────────▼─┐
      │   Database    │
      │   (Replicated)│
      └───────────────┘
```

## Development Environment Setup

### Frontend
- Node.js 18+
- npm or yarn
- Vite dev server on port 5173
- Vite proxy to backend on port 3001

### Backend
- Node.js 18+
- Express.js
- Development server on port 3001
- Hot reload with tsx

### Testing
- Vitest for unit tests
- React Testing Library for component tests
- Playwright for E2E tests
- Coverage reports with v8

## Configuration Management

### Environment Variables
```
.env.local (git ignored)
├── Development secrets
├── API endpoints
└── Feature flags
```

### Constants
```
src/constants/
├── validation.ts (validation rules)
├── messages.ts (UI strings)
└── config.ts (app config)
```

### Configuration Files
```
Root
├── tsconfig.json (TypeScript)
├── vite.config.ts (Frontend build)
├── vitest.config.ts (Testing)
├── playwright.config.ts (E2E)
└── package.json (Dependencies)
```
