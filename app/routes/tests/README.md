# Route Tests

This directory contains integration tests for route components using React Router's `createRoutesStub`.

## Running Tests

```bash
# Run all tests in watch mode
pnpm test

# Run tests once (CI mode)
pnpm test:run

# Run only login route tests
pnpm test login
```

## Test Structure

The tests use `createRoutesStub` to render complete route components with their actions and loaders. This approach:

- Tests the full user experience including form rendering and interactions
- Uses the existing Prisma mock system (no additional mocking needed)
- Verifies real navigation behavior and error handling
- Tests integration between components, actions, and loaders

## Writing New Route Tests

When adding tests for other routes, follow this pattern:

```typescript
import {createRoutesStub} from 'react-router';
import {render, screen} from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import YourRoute, {action, loader} from '~/routes/your-route';

function renderYourRoute() {
  const Stub = createRoutesStub([
    {
      path: '/your-route',
      Component: YourRoute,
      action: action,
      loader: loader,
    },
  ]);

  return render(<Stub initialEntries={['/your-route']} />);
}
```

See [`login.test.tsx`](./login.test.tsx) for a complete example.
