# CLAUDE.md

React 19, TypeScript (strict), Vite, Tailwind CSS 4, React Router 7. Path alias: `@/*` → `src/*`.

## Commands

- `npm run dev` — Vite dev server (localhost:5173)
- `npm run build` — TypeScript check + production build
- `npm run lint` — ESLint
- `npm run tscheck` — TypeScript type-check only
- `npm run knip` — Find unused files/deps/exports

Pre-commit hooks (Husky + lint-staged) auto-run Prettier and ESLint on staged files.

## References

- **`.claude/codebase-map.md`** — Module map, file locations, search shortcuts. **Read first** when searching for code.
- **`.claude/ui-patterns.md`** — Design system, component APIs, data loading hooks, code conventions. **Read first** when building UI.

## Keeping references up to date

After any session that adds/removes modules, creates new UI components, changes shared patterns, or modifies the project structure — check whether `.claude/codebase-map.md` or `.claude/ui-patterns.md` need updating. Specifically:

- **New module added** → add it to `codebase-map.md`
- **Module removed/renamed** → update `codebase-map.md`
- **New UI primitive or custom component** → add to `ui-patterns.md`
- **New data loading hook or shared utility** → add to both files as needed
- **Component API changed** (new variant, prop, etc.) → update `ui-patterns.md`
- **New layout/spacing convention established** → update `ui-patterns.md`
