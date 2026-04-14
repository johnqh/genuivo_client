# @sudobility/starter_client

API client SDK for Starter with TanStack Query hooks.

## Installation

```bash
bun add @sudobility/starter_client
```

Peer dependencies:

```bash
bun add react @tanstack/react-query @sudobility/types
```

## Usage

```ts
import { StarterClient } from "@sudobility/starter_client";
import { useHistories, useHistoriesTotal } from "@sudobility/starter_client/hooks";

// Create the HTTP client (dependency-injected NetworkClient)
const client = new StarterClient({ baseUrl: "https://api.example.com", networkClient });

// In a React component:
const { data, createHistory, updateHistory, deleteHistory } = useHistories(config);
const { data: total } = useHistoriesTotal(config);
```

## API

### StarterClient

HTTP client class constructed with `{ baseUrl, networkClient }`. Uses dependency injection via the `NetworkClient` interface -- no direct fetch calls.

### Hooks

- `useHistories(config)` -- Fetches user history list; provides `createHistory`, `updateHistory`, `deleteHistory` mutations with automatic cache invalidation.
- `useHistoriesTotal(config)` -- Fetches global total (public endpoint).

### Utilities

- `createAuthHeaders(token)` -- Builds auth header object
- `buildUrl(base, path)` -- URL construction helper
- `handleApiError(error)` -- Standardized API error handling
- `QUERY_KEYS` -- Type-safe TanStack Query cache key factory

## Development

```bash
bun run build          # Build ESM
bun run clean          # Remove dist/
bun test               # Run Vitest tests
bun run typecheck      # TypeScript check
bun run lint           # ESLint
bun run verify         # All checks + build (use before commit)
```

## Related Packages

- **starter_types** -- Shared type definitions (imported for API types)
- **starter_api** -- Backend server this client communicates with
- **starter_lib** -- Business logic library that wraps this client's hooks
- **starter_app** -- Web frontend (consumes transitively via starter_lib)
- **starter_app_rn** -- React Native app (consumes transitively via starter_lib)

## License

BUSL-1.1
