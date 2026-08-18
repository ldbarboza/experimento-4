# Project Files Overview

## Configuration Files

| File | Purpose |
|------|---------|
| `package.json` | Project dependencies and npm scripts |
| `tsconfig.json` | TypeScript configuration for src/ |
| `tsconfig.node.json` | TypeScript configuration for build tools |
| `vite.config.ts` | Vite bundler configuration |
| `vitest.config.ts` | Vitest test runner configuration |
| `playwright.config.ts` | Playwright E2E test configuration |
| `.eslintrc.cjs` | ESLint linting rules |
| `.gitignore` | Git ignore patterns |
| `.env.example` | Environment variables template |

## Documentation

| File | Purpose |
|------|---------|
| `README.md` | Project overview and quick start |
| `DEVELOPMENT.md` | Development workflow and guides |
| `ARCHITECTURE.md` | Architecture decisions and patterns |
| `FILES.md` | This file - project structure overview |

## Frontend - Source Code

### Components (`src/components/`)

| File | Purpose |
|------|---------|
| `ContactForm.tsx` | Main form component orchestrating form submission |
| `FormField.tsx` | Reusable input field component with label, input, and error display |

### Pages (`src/pages/`)

| File | Purpose |
|------|---------|
| `Contact.tsx` | Contact page component |

### Hooks (`src/hooks/`)

| File | Purpose |
|------|---------|
| `useContactForm.ts` | Custom hook managing form state, validation, and submission |

### API (`src/api/`)

| File | Purpose |
|------|---------|
| `contact.ts` | API client wrapper for form submission endpoint |

### Utilities (`src/utils/`)

| File | Purpose |
|------|---------|
| `validation.ts` | Validation functions for name, email, message |

### Constants (`src/constants/`)

| File | Purpose |
|------|---------|
| `validation.ts` | Validation rules and API endpoint constants |
| `messages.ts` | UI strings (errors, feedback, buttons) |

### Types (`src/types/`)

| File | Purpose |
|------|---------|
| `contact.ts` | TypeScript interfaces for form data and API responses |

### Styles (`src/styles/`)

| File | Purpose |
|------|---------|
| `ContactForm.module.css` | Component styles (responsive, accessible, mobile-first) |

### Test Setup (`src/test/`)

| File | Purpose |
|------|---------|
| `setup.ts` | Vitest setup file (imports testing-library/jest-dom) |

### Root Components

| File | Purpose |
|------|---------|
| `App.tsx` | Root application component |
| `main.tsx` | Application entry point |
| `index.html` | HTML entry point |

## Frontend - Tests

### Unit Tests (`src/utils/__tests__/`)

| File | Purpose |
|------|---------|
| `validation.test.ts` | Tests for validation functions (name, email, message) |

### Component Tests (`src/components/__tests__/`)

| File | Purpose |
|------|---------|
| `ContactForm.test.tsx` | Tests for form rendering, validation, submission, errors |

### Hook Tests (`src/hooks/__tests__/`)

| File | Purpose |
|------|---------|
| `useContactForm.test.ts` | Tests for form state management and handlers |

## Backend

### API Routes (`backend/routes/`)

| File | Purpose |
|------|---------|
| `contact.ts` | POST /api/contact endpoint with validation, sanitization, rate-limiting |

### Server (`backend/`)

| File | Purpose |
|------|---------|
| `server.ts` | Express server setup with middleware and routes |

## E2E Tests

| File | Purpose |
|------|---------|
| `e2e/contact-form.spec.ts` | Playwright tests for full user workflows |

## Summary by Type

### Configuration & Build (9 files)
- TypeScript configs
- Build tool configs
- Linting config
- Git and env config

### Documentation (4 files)
- README with features and setup
- Development guide with workflows
- Architecture documentation
- This files reference guide

### Frontend Components (5 files)
- ContactForm (main form)
- FormField (reusable input)
- Contact page
- App and main entry

### Frontend Logic (7 files)
- useContactForm hook
- API client
- Validation utilities
- Type definitions
- Constants (validation & messages)

### Frontend Styles (1 file)
- CSS modules for components

### Frontend Tests (3 files)
- Validation unit tests
- Component tests
- Hook tests

### Backend (2 files)
- Express server
- Contact route handler

### E2E Tests (1 file)
- Playwright test suite

**Total: 32 files**

## File Dependencies

```
index.html
└── src/main.tsx
    └── src/App.tsx
        └── src/pages/Contact.tsx
            └── src/components/ContactForm.tsx
                ├── src/hooks/useContactForm.ts
                │   ├── src/api/contact.ts
                │   ├── src/utils/validation.ts
                │   └── src/constants/messages.ts
                └── src/components/FormField.tsx
                    └── src/styles/ContactForm.module.css

Backend:
src/utils/validation.ts ◄── src/constants/validation.ts
src/types/contact.ts ◄── All components and backend

backend/server.ts
└── backend/routes/contact.ts
    ├── src/utils/validation.ts
    └── src/types/contact.ts
```

## Next Steps

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Start development:**
   ```bash
   npm run dev
   ```

3. **Run tests:**
   ```bash
   npm test
   ```

4. **Build for production:**
   ```bash
   npm run build
   ```

5. **Integration ready:**
   - Backend database connection
   - Email notifications
   - Environment variables configuration
   - HTTPS setup for production
   - Analytics integration
   - Admin dashboard (optional)
