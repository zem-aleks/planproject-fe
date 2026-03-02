# UI Patterns & Component Reference

## Available Shadcn/UI Components (`src/ui/`)

accordion, avatar, badge, breadcrumb, button, card, chart, checkbox, command, dialog,
drawer, dropdown-menu, input, label, popover, progress, select, separator, sheet,
sidebar, skeleton, sonner, spinner, switch, table, tabs, textarea, toggle, toggle-group, tooltip

Custom components in `src/ui/custom/`: DaysCounter, MarkdownFormat, InputArray, ColorPicker, MultiSelectCheckbox

## Key Component APIs

### Button (`@/ui/button`)
- Variants: `default | success | warning | destructive | outline | secondary | ghost | link`
- Sizes: `default | sm | lg | icon`
- Props: `loading?: boolean`, `asChild?: boolean`
- Icons auto-size to `size-4` via `[&_svg:not([class*='size-'])]:size-4`

### Badge (`@/ui/badge`)
- Variants: `default | warning | success | secondary | destructive | outline`
- Props: `asChild?: boolean`
- Auto-sizes icons to `size-3` via `[&>svg]:size-3`

### Card (`@/ui/card`)
- Sub-components: `Card, CardHeader, CardTitle, CardDescription, CardAction, CardContent, CardFooter`
- Base: `rounded-xl border border-neutral-200 bg-white shadow-sm` (dark: `border-neutral-800 bg-neutral-950`)
- Default padding via sub-components: `px-6`, `py-6` gap
- **Common override pattern**: `<Card className="flex flex-col gap-2 p-4">` — bypasses sub-components for simpler layouts

### Separator (`@/ui/separator`)
- Horizontal (default) or vertical via `orientation` prop

### Spinner (`@/ui/spinner`)
- Wraps `Loader2Icon` with `animate-spin`, default `size-4`

### Progress (`@/ui/progress`)
- Radix-based, `h-2`, `bg-primary/20` track, `bg-primary` fill

## Color Tokens (from `src/index.css`)

Use semantic tokens, NOT raw colors:
- `text-foreground` / `text-muted-foreground` (secondary)
- `bg-background` / `bg-card` / `bg-muted` / `bg-accent` / `bg-primary` / `bg-secondary`
- `border-border` (default) / `border-neutral-200` dark:`border-neutral-800`
- `text-primary` / `text-destructive`

For status colors use Tailwind direct: `text-green-500`, `text-orange-500`, `text-red-500`, `bg-green-600/30`

## Layout Patterns

### Spacing
- Card internal: `p-4` or `p-5` (flat Card, no sub-components)
- Between cards: `gap-4`. Within cards: `gap-2` or `gap-3`
- Inner bordered items: `rounded-lg border p-3` or `p-4`

### Common flex
```
flex flex-col gap-2                          — vertical, 8px
flex flex-col gap-4                          — vertical, 16px (between sections)
flex items-center gap-2                      — horizontal, centered
flex items-center justify-between gap-2      — space-between
flex items-start gap-3                       — align top
flex flex-wrap gap-1.5                       — wrapping badges/tags
```

### Responsive grid
```
grid grid-cols-1 gap-4 lg:grid-cols-2
grid grid-cols-1 gap-2 sm:grid-cols-2
```

### Section header pattern
```tsx
<div className="flex items-center gap-2">
  <span className="text-muted-foreground"><Icon className="size-4" /></span>
  <h3 className="text-base font-semibold">Title</h3>
  <Badge variant="secondary">{count}</Badge>
</div>
```

### List item with icon
```tsx
<div className="flex items-start gap-2 text-sm">
  <Icon className="text-muted-foreground mt-0.5 size-3.5 shrink-0" />
  <span className="leading-relaxed">Content</span>
</div>
```

### Bordered card item
```tsx
<div className="rounded-lg border p-3">
  <div className="text-sm font-medium">Title</div>
  <p className="text-muted-foreground mt-1 text-xs leading-relaxed">Description</p>
</div>
```

## Typography

- Page titles: `text-xl font-bold`
- Section headers: `text-lg font-semibold` or `text-base font-semibold`
- Item titles: `text-sm font-medium`
- Body: `text-sm leading-relaxed`
- Secondary: `text-muted-foreground text-xs` or `text-sm`
- Tiny labels: `text-[10px]`

## Icons

Use `lucide-react`. Default sizing in buttons/badges is automatic. Standalone: `className="size-4"` or `size-3.5`.

## Data Loading — TanStack Query Adapters (`src/lib/adapters/`)

TanStack Query v5 with a shared cache. Adapter hooks return discriminated union types (same `switch (state.type)` pattern). Import from `@/lib/adapters`.

| Hook | When to use | Returns |
|---|---|---|
| `useLoadableQuery({ queryKey, queryFn })` | Eager-load on mount | `{ state: LoadableData, reload }` |
| `useReloadableQuery({ queryKey, queryFn })` | Need `reload()`, `setData()`, and shared cache | `{ state: ReloadableData, reload, setData }` |
| `usePollingQuery({ queryKey, queryFn, interval })` | Interval-based refetching | `{ state: PollingData, reload, stopPolling, continuePolling, setData }` |
| `useLazyMutation({ mutationFn, invalidateKeys? })` | Load on demand (user action / form submit) | `{ state: LazyLoadableData, load, reset }` |

### Query keys (`src/lib/queryKeys.ts`)

Always use the centralized factory:
```tsx
import { queryKeys } from '@/lib/queryKeys';
queryKeys.projects.detail(projectId)   // ['projects', projectId]
queryKeys.milestones.byPhase(phaseId)  // ['milestones', { phaseId }]
queryKeys.tasks.active(projectId)      // ['tasks', 'active', { projectId }]
```

### Rendering pattern
```tsx
import { useLoadableQuery } from '@/lib/adapters';
import { queryKeys } from '@/lib/queryKeys';

const { state, reload } = useLoadableQuery({
  queryKey: queryKeys.projects.detail(projectId),
  queryFn: ({ signal }) => getProject(projectId, { signal }),
});

switch (state.type) {
  case 'loading':
    return <Spinner />;

  case 'loaded':
    return <ProjectView data={state.data} />;

  case 'error':
    return <ErrorMessage />;

  default:
    return notReachable(state);    // exhaustive check — always include
}
```

For `useReloadableQuery`, also handle `case 'reloading':` (show existing data + loading indicator).
For `useLazyMutation`, also handle `case 'not_requested':` (show trigger button/initial state).
For `usePollingQuery`, also handle `case 'reloading':` and `case 'stopped':`.

### Cache invalidation

Use `invalidateKeys` in `useLazyMutation` for automatic invalidation after mutations:
```tsx
const { state, load } = useLazyMutation({
  mutationFn: (params) => completeMilestone(params),
  invalidateKeys: [queryKeys.milestones.byPhase(phaseId), queryKeys.tasks.active(projectId)],
});
```

For manual invalidation, use `useQueryClient()` + `queryClient.invalidateQueries()`. See `src/lib/invalidationMap.ts` for the full mutation-to-key mapping.

### Legacy hooks (`src/utils/`) — avoid for new code
`useLoadableData`, `useReloadableData`, `useLazyLoadableData`, `usePollableData` still exist for a few mutation-on-mount components but should not be used in new code.

## Code Conventions

- `cn()` from `@/ui/lib/utils` for conditional class merging
- `notReachable()` from `@/utils/notReachable` for **exhaustive switch/if-else** — always use in `default:` case
- Prefer `import type { ... }` for type-only imports
- Arrow function components, named exports, no default exports
- Props typed inline: `({ project }: { project: ProjectPreviewEntity })`
- Path alias: `@/*` → `src/*`

## Import Paths

```tsx
import { Button } from '@/ui/button';
import { Card, CardHeader, CardTitle, CardDescription, CardAction, CardContent, CardFooter } from '@/ui/card';
import { Badge } from '@/ui/badge';
import { Separator } from '@/ui/separator';
import { Spinner } from '@/ui/spinner';
import { Progress } from '@/ui/progress';
import { Skeleton } from '@/ui/skeleton';
import { cn } from '@/ui/lib/utils';
import { MarkdownFormat } from '@/ui/custom/MarkdownFormat';
import { notReachable } from '@/utils/notReachable';
import { useLoadableQuery, useReloadableQuery, useLazyMutation, usePollingQuery } from '@/lib/adapters';
import { queryKeys } from '@/lib/queryKeys';
```
