# Testing Guide - James Square Booking

## Philosophy

Our testing strategy prioritizes **confidence** and **maintainability**:
- Test business logic and critical utilities, not implementation details
- Prevent regressions through comprehensive coverage of core features
- Make tests readable as documentation of expected behavior
- Keep tests fast and isolated

---

## Test Infrastructure

### Framework: Vitest

We use **Vitest** for all testing:
- Faster than Jest (native ES modules)
- Better TypeScript support out-of-the-box
- Compatible with existing Vite setup in sub-apps
- UI mode for debugging: `npm run test:ui`

### Configuration

- **Config file:** `vitest.config.ts`
- **Setup:** `src/test/setup.ts`
- **Environment:** happy-dom (lightweight DOM simulation)
- **Coverage provider:** v8

---

## Running Tests

```bash
# Run all tests in watch mode
npm test

# Run tests once (CI mode)
npm test -- --run

# Run with UI (debugging)
npm run test:ui

# Run with coverage report
npm run test:coverage

# Run specific test file
npm test src/lib/__tests__/voteExpiry.test.ts

# Run tests matching pattern
npm test -- vote
```

---

## When to Write Tests

### ✅ ALWAYS Test

1. **Utility functions** (`src/lib/*.ts`)
   - Pure functions with no dependencies
   - Business logic (voting, dates, formatting)
   - Security-critical functions (sanitizeHtml)

2. **API routes** (`src/app/api/**/route.ts`)
   - Authentication logic
   - Input validation
   - Error handling
   - External API integrations

3. **Cloud Functions** (`functions/src/**`)
   - Scheduled functions
   - Firestore triggers
   - Callable functions
   - Critical business logic

4. **Custom hooks** (complex state management)
   - When hooks contain business logic
   - When hooks are reused across components
   - Example: `useAdminAuth`, `useBookingStats`

### 🟡 SOMETIMES Test

1. **Complex components** with significant logic
   - Multi-step forms
   - Data transformation before render
   - Client-side state machines

2. **Integration points** (Firebase, external APIs)
   - Critical paths only
   - Use mocks to avoid flakiness

### ❌ SKIP Testing

1. **Simple presentational components**
   - No logic, just render props
   - Example: `<Button>`, `<Card>`, pure UI

2. **Next.js page components** (route handlers)
   - Test the underlying logic/components instead
   - Page components are just wrappers

3. **Type definitions** (`*.d.ts`, interfaces)
   - TypeScript handles type checking

---

## File Organization

### Co-locate tests with source files

```
src/lib/
├── voteExpiry.ts
└── __tests__/
    └── voteExpiry.test.ts

functions/src/
├── metrics.ts
└── __tests__/
    └── metrics.test.ts
```

### Naming convention

- Test files: `*.test.ts` or `*.test.tsx`
- Test suites: Use `describe()` blocks
- Test cases: Use `it()` or `test()`

---

## Writing Good Tests

### Structure: Arrange-Act-Assert

```typescript
it('should format time remaining correctly', () => {
  // Arrange: Set up test data
  const ms = 3600000 // 1 hour in milliseconds

  // Act: Execute the function
  const result = formatTimeRemaining(ms)

  // Assert: Verify the result
  expect(result).toBe('Closes in 1 hour')
})
```

### Descriptive test names

```typescript
// ❌ Bad
it('works', () => { ... })
it('test formatTime', () => { ... })

// ✅ Good
it('should return "Closed" for negative values', () => { ... })
it('should handle month boundaries correctly', () => { ... })
it('should remove script tags from user input', () => { ... })
```

### Group related tests

```typescript
describe('voteExpiry', () => {
  describe('formatTimeRemaining', () => {
    it('should return "Closed" for 0ms', () => { ... })
    it('should return "Closes soon" for < 1 minute', () => { ... })
  })

  describe('getVoteStatus', () => {
    describe('scheduled votes', () => {
      it('should return scheduled status when startsAt is future', () => { ... })
    })

    describe('open votes', () => {
      it('should return open status with time remaining', () => { ... })
    })
  })
})
```

### Test edge cases

Always test boundaries:
- Zero values
- Negative values
- Empty strings/arrays
- Null/undefined
- Maximum values
- Boundary conditions (59 seconds vs 60 seconds)

---

## Mocking Strategies

### Firebase Mocking

For Firebase operations, create mocks in `src/test/mocks/`:

```typescript
// src/test/mocks/firebase.ts
import { vi } from 'vitest'

export const mockAuth = {
  verifyIdToken: vi.fn(),
  setCustomUserClaims: vi.fn(),
}

export const mockFirestore = {
  collection: vi.fn(() => ({
    doc: vi.fn(() => ({
      get: vi.fn(),
      set: vi.fn(),
    })),
  })),
}
```

### External API Mocking

Use `vi.fn()` for external services:

```typescript
import { vi } from 'vitest'
import * as Resend from 'resend'

vi.mock('resend', () => ({
  Resend: vi.fn(() => ({
    emails: {
      send: vi.fn().mockResolvedValue({ id: 'test-email-id' }),
    },
  })),
}))
```

### Date/Time Mocking

Use `vi.useFakeTimers()` for time-dependent tests:

```typescript
import { vi } from 'vitest'

it('should handle time-based logic', () => {
  vi.useFakeTimers()
  vi.setSystemTime(new Date('2026-01-24T12:00:00Z'))

  // Your test code here

  vi.useRealTimers() // Cleanup
})
```

---

## Coverage Targets

### Current Coverage (Phase 2 Complete)

- **Utility functions:** 93 tests, 3 files
  - `voteExpiry.ts`: 32 tests ✅
  - `sanitizeHtml.ts`: 46 tests ✅
  - `metrics.ts`: 15 tests ✅

### Target Coverage

- **Utilities:** 70%+ (critical business logic)
- **API routes:** 60%+ (auth, validation, error handling)
- **Cloud Functions:** 60%+ (triggers, callables)
- **Overall:** 50%+ (realistic for Next.js app)

### What NOT to include in coverage

Excluded from coverage (see `vitest.config.ts`):
- `node_modules/`
- `src/test/` (test utilities)
- `**/*.d.ts` (type definitions)
- `**/*.config.*` (config files)
- `src/app/**/*.tsx` (page components - test underlying logic instead)

---

## Testing Patterns

### Testing Pure Functions (Easiest)

```typescript
import { addDuration } from '../voteExpiry'

it('should add 1 hour correctly', () => {
  const baseDate = new Date('2026-01-24T12:00:00Z')
  const result = addDuration(baseDate, '1h')
  expect(result.getTime() - baseDate.getTime()).toBe(3600000)
})
```

### Testing with Mocks

```typescript
import { vi } from 'vitest'

// Mock Firebase
vi.mock('firebase-admin', () => ({
  firestore: vi.fn(() => mockFirestore),
  auth: vi.fn(() => mockAuth),
}))

it('should save to Firestore', async () => {
  await saveData({ id: '123', name: 'Test' })
  expect(mockFirestore.collection).toHaveBeenCalledWith('users')
})
```

### Testing API Routes

```typescript
import { GET } from '../route'
import { NextRequest } from 'next/server'

it('should return 401 without auth', async () => {
  const request = new NextRequest('http://localhost/api/admin')
  const response = await GET(request)

  expect(response.status).toBe(401)
})
```

### Testing React Components (Future)

```typescript
import { render, screen } from '@testing-library/react'
import { Button } from '../Button'

it('should call onClick when clicked', async () => {
  const handleClick = vi.fn()
  render(<Button onClick={handleClick}>Click me</Button>)

  await userEvent.click(screen.getByRole('button'))
  expect(handleClick).toHaveBeenCalledTimes(1)
})
```

---

## Debugging Tests

### Using test.only

```typescript
// Run only this test
it.only('should debug this specific case', () => {
  // ...
})

// Run only this suite
describe.only('voteExpiry', () => {
  // ...
})
```

### Using Vitest UI

```bash
npm run test:ui
```

Opens an interactive UI for:
- Viewing test results
- Filtering tests
- Inspecting failures
- Debugging with console output

### Console logging

```typescript
it('should debug output', () => {
  const result = someFunction()
  console.log('DEBUG:', result) // Will show in test output
  expect(result).toBe('expected')
})
```

---

## Common Pitfalls

### ❌ Testing implementation details

```typescript
// Bad: Tests internal variable names
it('should set isLoading to true', () => {
  expect(component.state.isLoading).toBe(true)
})

// Good: Tests observable behavior
it('should show loading spinner while fetching', () => {
  expect(screen.getByRole('progressbar')).toBeInTheDocument()
})
```

### ❌ Brittle snapshot tests

```typescript
// Bad: Will break on any UI change
expect(component).toMatchSnapshot()

// Good: Test specific behavior
expect(screen.getByText('Submit')).toBeEnabled()
```

### ❌ Testing too much at once

```typescript
// Bad: Integration test that's hard to debug
it('should handle entire user flow', () => {
  // 50 lines of test code...
})

// Good: Small, focused tests
it('should validate email format', () => { ... })
it('should submit form on valid input', () => { ... })
it('should show error on invalid email', () => { ... })
```

---

## CI/CD Integration

### Running in CI

Tests run automatically in CI:

```yaml
# .github/workflows/test.yml (example)
- name: Run tests
  run: npm test -- --run --reporter=verbose
```

### Coverage enforcement

Set minimum coverage thresholds in `vitest.config.ts`:

```typescript
coverage: {
  statements: 50,
  branches: 50,
  functions: 50,
  lines: 50,
}
```

---

## Next Steps (Future Phases)

### Phase 3: API Route Tests
- Mock Firebase Admin SDK
- Test authentication flows
- Test email sending (Resend/SendGrid mocks)

### Phase 4: Cloud Functions Tests
- Use `firebase-functions-test`
- Test scheduled functions
- Test Firestore triggers

### Phase 5: Component Tests
- Extract admin components first
- Test with @testing-library/react
- Focus on components with business logic

---

## Resources

- **Vitest docs:** https://vitest.dev/
- **Testing Library:** https://testing-library.com/
- **Firebase Functions Test:** https://firebase.google.com/docs/functions/unit-testing

---

**Last Updated:** 2026-01-24 (Phase 2 Complete)
**Test Count:** 93 tests passing
**Coverage:** Utilities fully tested, API/Functions pending
