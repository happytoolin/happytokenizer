# Development Commands

```bash
pnpm dev          # Start development server
pnpm build        # Production build
pnpm typecheck    # TypeScript validation
pnpm lint         # ESLint with React/TS rules
pnpm format       # Prettier code formatting
```

# Code Style Guidelines

## Imports & Organization

- External imports first, then internal imports (use @/\* path alias)
- Group React imports separately from other imports
- Use absolute imports with @/\* alias for internal modules

## TypeScript & Types

- Strict TypeScript enabled - always type function parameters and returns
- Define interfaces at top of files when used locally
- Export types from dedicated files when shared across components
- Use `type` for type aliases, `interface` for object shapes

## React Patterns

- Functional components with hooks only (no class components)
- Use `const` for component declarations
- Destructure props and hook returns
- Prefer `useCallback` for event handlers passed to children

## Naming Conventions

- Components: PascalCase (TokenizerApp, TokenDisplay)
- Functions/variables: camelCase (useTokenizer, tokenCount)
- Files: PascalCase for components (TokenizerApp.tsx), camelCase for utilities (tokenUtils.ts)
- Constants: UPPER_SNAKE_CASE for exported constants

## Error Handling

- Use error boundaries for virtualized components
- Return error states from hooks, don't throw in UI code
- Handle async errors with try-catch in workers and utilities

## Styling

- Use Tailwind CSS v4 CSS-in-JS (no separate CSS files)
- Follow industrial utility theme with orange accent
- Mobile-first responsive design
- Use Radix UI primitives with custom styling
