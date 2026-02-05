# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

- `npm run dev` — Start Vite dev server (localhost:5173)
- `npm run build` — TypeScript check + Vite production build
- `npm run lint` — Run ESLint
- `npm run tscheck` — TypeScript type-check without emitting
- `npm run knip` — Find unused files, dependencies, and exports

Pre-commit hooks (Husky + lint-staged) auto-run Prettier and ESLint on staged `.ts/.tsx/.js/.jsx` files.

## Architecture

**Stack:** React 19, TypeScript (strict), Vite, Tailwind CSS 4, React Router 7

**Module structure** (`src/modules/`): Feature-based organization with `pages/`, `components/`, and `api/` subdirectories per module.

**UI layer** (`src/ui/`): Shadcn/UI components (Radix UI + Tailwind + CVA variants) live at top level. Custom composed components in `ui/custom/`. Utility `cn()` helper in `ui/lib/utils.ts` combines clsx + tailwind-merge.

**Data loading hooks** (`src/utils/`): Custom hooks replace a global state manager:
- `useLoadableData` — eager-load on mount, states: loading | loaded | error
- `useReloadableData` — adds reload() and setData() to above
- `useLazyLoadableData` — load on demand (not_requested → loading → loaded | error)
- `usePollableData` — interval-based refetching

All hooks integrate AbortController for request cancellation.

**API layer** (`src/modules/api/api.ts`): Shared Axios instance with base URL from env, 5-minute timeout, response interceptor (unwraps `response.data`), and `setApiAuth()` for Bearer token injection.

**Environment config** (`src/modules/config/index.ts`): Zod-validated env vars — `VITE_ENVIRONMENT`, `VITE_BACKEND_URL`, `VITE_FRONTEND_URL`. Access via imported `ENV` object.

**Routing** (`src/routing/components/AppRoutes.tsx`): BrowserRouter with route definitions. Vercel rewrites configured for SPA.

**Type safety patterns:** `notReachable()` helper in `src/utils/notReachable.ts` for exhaustive switch/if checks.

## Path Alias

`@/*` maps to `src/*` (configured in both tsconfig and vite.config.ts).

## Styling

Tailwind CSS with CSS custom properties for theming (light/dark via `.dark` class). Colors use OkLCH color space. Theme variables defined in `src/index.css`.
