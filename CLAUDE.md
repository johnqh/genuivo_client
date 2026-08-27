# Genuivo Client

> **Git policy — never auto-commit or auto-push.** Leave your work in the working tree.
> Run `git commit`, `git push`, `gh pr create`, or `scripts/push_all.sh` **only when the user
> explicitly asks in that turn**. Approval for an earlier change does not carry forward, and
> finishing a task is not permission to commit it.

API client SDK for Genuivo with TanStack Query hooks.

**npm**: `@sudobility/genuivo_client` (public, BUSL-1.1)

## Tech Stack

- **Language**: TypeScript (strict mode)
- **Runtime**: Bun
- **Package Manager**: Bun (do not use npm/yarn/pnpm for installing dependencies)
- **Build**: TypeScript compiler (ESM)
- **Test**: Vitest
- **Data Fetching**: TanStack Query 5

## Project Structure

```
src/
├── index.ts                          # Main exports
├── types.ts                          # QUERY_KEYS factory, config types
├── network/
│   ├── GenuivoClient.ts              # HTTP client class (DI-based)
│   └── GenuivoClient.test.ts
├── hooks/
│   ├── index.ts                      # Hook exports
│   ├── useHistories.ts               # Query + mutation hook for user histories
│   └── useHistoriesTotal.ts          # Query hook for global total
└── utils/
    ├── index.ts                      # Utility exports
    └── genuivo-helpers.ts            # createAuthHeaders, buildUrl, handleApiError
```

## Commands

```bash
bun run build          # Build ESM
bun run clean          # Remove dist/
bun test               # Run Vitest tests (colocated *.test.ts files)
bun run typecheck      # TypeScript check
bun run lint           # Run ESLint
bun run verify         # All checks + build (use before commit)
bun run prepublishOnly # Clean + build (runs on publish)
```

## Key Concepts

### GenuivoClient

HTTP client class constructed with `{ baseUrl, networkClient }`. Uses dependency injection via the `NetworkClient` interface from `@sudobility/types` — no direct fetch calls.

### Hooks

- `useHistories(config)` — fetches user history list and provides `createHistory`, `updateHistory`, `deleteHistory` mutations with automatic query invalidation
- `useHistoriesTotal(config)` — fetches global total (public endpoint)

### QUERY_KEYS

Type-safe cache key factory for TanStack Query. Used internally by hooks and available for manual invalidation.

### Cache Settings

- `staleTime`: 5 minutes
- `gcTime`: 30 minutes

## Peer Dependencies

- `react` (>=18)
- `@tanstack/react-query` (>=5)
- `@sudobility/types` — NetworkClient interface, BaseResponse

## Related Projects

- **genuivo_types** — Shared type definitions; this project imports all API types (`History`, request/response types, `BaseResponse`)
- **genuivo_api** — Backend server that this client SDK communicates with over HTTP
- **genuivo_lib** — Business logic library that consumes this client's hooks and `GenuivoClient` class
- **genuivo_app** — Web frontend that uses this client transitively via genuivo_lib
- **genuivo_app_rn** — React Native app that uses this client via file: links

Dependency injection is central: `NetworkClient` interface is provided by the consumer, allowing different fetch implementations per platform (web vs React Native).

## Coding Patterns

- `QUERY_KEYS` factory in `src/types.ts` provides type-safe cache keys for TanStack Query -- always use it for query keys
- `GenuivoClient` class accepts `{ baseUrl, networkClient }` via constructor -- never use `fetch` directly inside this package
- Hooks (`useHistories`, `useHistoriesTotal`) wrap TanStack Query and use `GenuivoClient` internally
- `useHistories` combines query and mutations in a single hook — mutations automatically invalidate related queries after success
- Default `staleTime` is 5 minutes and `gcTime` is 30 minutes -- respect these defaults unless there is a specific reason to override
- Utility functions in `src/utils/genuivo-helpers.ts` handle auth headers (`createAuthHeaders`), URL construction (`buildUrl`), and API error handling (`handleApiError`)
- `FirebaseIdToken` must be passed to all protected endpoint calls for authentication

## Gotchas

- `NetworkClient` is dependency-injected -- never import or use `fetch` directly; all HTTP calls go through the injected `networkClient`
- Mutations auto-invalidate related queries -- adding a new mutation must include proper `onSuccess` invalidation to keep caches consistent
- `FirebaseIdToken` is required for all authenticated endpoints; omitting it will result in 401/403 errors from the API
- The `QUERY_KEYS` factory must be kept in sync with API route changes -- if a route path changes, update the corresponding key
- This is a published npm package (`@sudobility/genuivo_client`) -- breaking changes require version bumps and coordination with consumers

## Git Workflow

- Do not use feature branches for code changes. Always stay on the current branch.
