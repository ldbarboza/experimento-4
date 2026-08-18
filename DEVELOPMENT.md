# Development Guide

## Quick Start

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Start development servers:**
   ```bash
   # Terminal 1: Frontend dev server
   npm run dev

   # Terminal 2: Backend server (when backend integration is ready)
   npm run dev:backend
   ```

3. **Open your browser:**
   ```
   http://localhost:5173
   ```

## Development Workflow

### Adding a New Feature

1. Create a feature branch
2. Write tests first (TDD approach)
3. Implement the feature
4. Run tests to verify
5. Check accessibility and responsiveness
6. Submit PR for review

### Testing

#### Run all tests:
```bash
npm test
```

#### Run tests in watch mode:
```bash
npm test -- --watch
```

#### Run specific test file:
```bash
npm test -- src/utils/__tests__/validation.test.ts
```

#### Generate coverage report:
```bash
npm test -- --coverage
```

#### Run E2E tests:
```bash
npm run test:e2e

# Run specific test file:
npm run test:e2e -- e2e/contact-form.spec.ts

# Run in headed mode (see browser):
npm run test:e2e -- --headed
```

### Building

#### Development build:
```bash
npm run dev
```

#### Production build:
```bash
npm run build
```

#### Preview production build locally:
```bash
npm run preview
```

## File Organization

### Components (`src/components/`)
- Reusable UI components
- Each component should have its own test file
- Use CSS Modules for scoped styling

### Hooks (`src/hooks/`)
- Custom React hooks
- Should be pure functions with no side effects
- Include test files for complex logic

### API (`src/api/`)
- API client functions
- Handles HTTP requests and error handling
- Should be environment-agnostic

### Utils (`src/utils/`)
- Pure utility functions
- Shared across components and hooks
- Should be thoroughly tested

### Constants (`src/constants/`)
- Single source of truth for repeated values
- Validation rules, messages, endpoints
- Extract magic strings here

### Types (`src/types/`)
- TypeScript interfaces and types
- Should not contain implementation logic

## Code Standards

### TypeScript
- Always use explicit type annotations
- Prefer interfaces for object shapes
- Use const assertions for literal types

### React
- Use functional components and hooks
- Props should be properly typed
- Extract complex logic into custom hooks

### Testing
- Write tests as you develop
- Aim for 80%+ coverage
- Test behavior, not implementation details
- Use meaningful test descriptions

### Accessibility
- Use semantic HTML
- Always include proper labels
- Test with keyboard navigation
- Verify with screen readers

### Performance
- Avoid unnecessary re-renders
- Use React.memo for expensive components
- Lazy load when appropriate
- Monitor bundle size

## Common Tasks

### Adding a new validation rule:

1. Add rule to `src/constants/validation.ts`
2. Add validation function to `src/utils/validation.ts`
3. Add error message to `src/constants/messages.ts`
4. Add tests to `src/utils/__tests__/validation.test.ts`

### Adding a new form field:

1. Add to `ContactFormData` type in `src/types/contact.ts`
2. Add validation in `src/utils/validation.ts`
3. Add FormField component to form in `src/components/ContactForm.tsx`
4. Update form tests

### Styling:

1. Use CSS Modules for component-specific styles
2. Follow mobile-first approach
3. Use semantic class names
4. Test on mobile devices (320px+)

## Debugging

### React DevTools
- Install React DevTools browser extension
- Inspect component props and state
- Profile performance

### Browser DevTools
- Inspect network requests in Network tab
- Check console for errors
- Use debugger for breakpoints

### Server Logs
- Check terminal output for backend errors
- Use console.log for debugging
- Consider using a logging library in production

## Troubleshooting

### Tests failing
1. Check that dependencies are installed: `npm install`
2. Clear cache: `npm test -- --clearCache`
3. Check test file syntax
4. Verify mocks are set up correctly

### Dev server not starting
1. Check port 5173 is available
2. Check for syntax errors in main files
3. Clear `.vite` cache
4. Restart the dev server

### E2E tests failing
1. Ensure dev server is running on port 5173
2. Check for flaky tests with timeouts
3. Run tests in headed mode: `npm run test:e2e -- --headed`
4. Check for hardcoded waits that may timeout

### Type errors
1. Run `npm run build` to see all type errors
2. Check imports and exports
3. Verify tsconfig.json paths
4. Use `tsc --noEmit` to check types without building

## Git Workflow

### Before committing:
```bash
# Run tests
npm test

# Run type check
npm run build

# Run linter
npm run lint
```

### Commit message format:
```
type(scope): description

Longer explanation if needed.

Closes #123
```

Types: feat, fix, docs, style, refactor, test, chore

## Performance Monitoring

### Before deploying:
- Run Lighthouse audit in Chrome DevTools
- Check bundle size: `npm run build`
- Test on slow 3G network (DevTools)
- Test on low-end device or throttled CPU

### Recommended lighthouse scores:
- Performance: 90+
- Accessibility: 95+
- Best Practices: 90+
- SEO: 90+

## Production Checklist

- [ ] All tests pass
- [ ] Coverage >80%
- [ ] No console errors or warnings
- [ ] Accessibility tests pass
- [ ] Manual testing complete
- [ ] Performance acceptable
- [ ] Environment variables configured
- [ ] HTTPS enabled
- [ ] CSP headers configured
- [ ] Rate limiting active
- [ ] Error tracking set up
- [ ] Analytics configured
- [ ] Privacy policy updated
