# Contributing to ZeroCode Portfolio Monorepo

Welcome to the ZeroCode Monorepo! This document details how to contribute and where everything is organized.

## Testing Structure

We avoid root-level `tests/` or `tests-e2e/` directories. Instead, **all tests live alongside the code they verify**, directly within their respective app or package.

### 1. Unit Tests (Vitest)

Unit tests should follow the `*.test.ts` or `*.test.tsx` naming convention.
Place them in the same directory as the component or function they are testing.

```text
apps/[app-name]/src/components/
  ├── MyComponent.tsx
  └── MyComponent.test.tsx
```

### 2. End-to-End Tests (Playwright)

End-to-End tests should follow the `*.spec.ts` naming convention.
If an app requires E2E tests, place them in an `e2e/` or `tests/` directory **inside** the specific app workspace.

```text
apps/[app-name]/e2e/
  ├── login.spec.ts
  └── checkout.spec.ts
```

### Running Tests

- Root-level `npm run test` executes all unit tests across the monorepo.
- Root-level `npm run test:e2e` executes all Playwright tests.

## Submitting Pull Requests

1. Create a feature branch: `git checkout -b feature/your-feature`
2. Commit your changes: `git commit -m "feat: adding a feature"`
3. Push your branch: `git push origin feature/your-feature`
4. Create a Pull Request against `main`. Ensure all linting checks and tests pass.
