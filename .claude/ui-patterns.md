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

## Data Loading — TanStack Query v5

Direct `useQuery` / `useMutation` from `@tanstack/react-query`. Shared cache via `QueryClient` in `src/lib/queryClient.ts`.

| Hook | When to use | Key return fields |
|---|---|---|
| `useQuery<Data, AxiosError<Error>>({ queryKey, queryFn })` | Eager-load on mount, reload, polling | `{ data, error, status, refetch }` |
| `useMutation({ mutationFn })` | User-triggered actions (form submit, button click) | `{ status, data, error, mutate, reset }` |

### Query keys (`src/lib/queryKeys.ts`)

Always use the centralized factory:
```tsx
import { queryKeys } from '@/lib/queryKeys';
queryKeys.projects.detail(projectId)   // ['projects', projectId]
queryKeys.milestones.byPhase(phaseId)  // ['milestones', { phaseId }]
queryKeys.tasks.active(projectId)      // ['tasks', 'active', { projectId }]
```

### Query rendering pattern
```tsx
import { useQuery } from '@tanstack/react-query';
import type { AxiosError } from 'axios';
import { queryKeys } from '@/lib/queryKeys';

const { data, error, status, refetch } = useQuery<ProjectEntity, AxiosError<Error>>({
  queryKey: queryKeys.projects.detail(projectId),
  queryFn: ({ signal }) => getProject(projectId, { signal }),
});

switch (status) {
  case 'pending':
    return <Spinner />;

  case 'success':
    return <ProjectView data={data!} />;

  case 'error':
    return <ErrorMessage error={error} />;

  default:
    return notReachable(status);    // exhaustive check — always include
}
```

**Note:** When `status === 'success'`, destructured `data` is still `Data | undefined` (TS can't narrow across separate variables). Use `data!` in success branches — safe because TanStack guarantees `data` is defined when `status === 'success'`.

### Mutation rendering pattern
```tsx
import { useMutation } from '@tanstack/react-query';

const { status, data, error, mutate } = useMutation({ mutationFn: completeMilestone });

switch (status) {
  case 'idle':       // not yet triggered
  case 'pending':    // in flight
  case 'success':    // data! available
  case 'error':      // error! available
}
```

### Polling pattern
```tsx
const [polling, setPolling] = useState(true);
const { data, status } = useQuery<Data, AxiosError<Error>>({
  queryKey, queryFn,
  refetchInterval: polling ? 3000 : false,
});
// stopPolling → setPolling(false)
```

### Optimistic updates / setData
```tsx
const queryClient = useQueryClient();
queryClient.setQueryData(queryKey, newData);
```

### Cache invalidation

Use `useQueryClient()` + `queryClient.invalidateQueries({ queryKey })` for manual invalidation after mutations.

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
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { queryKeys } from '@/lib/queryKeys';
```
