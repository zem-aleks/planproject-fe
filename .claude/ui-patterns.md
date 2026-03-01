# UI Patterns & Component Reference

## Available Shadcn/UI Components (`src/ui/`)

accordion, avatar, badge, breadcrumb, button, card, chart, checkbox, command, dialog,
drawer, dropdown-menu, input, label, popover, progress, select, separator, sheet,
sidebar, skeleton, sonner, spinner, switch, table, tabs, textarea, toggle, toggle-group, tooltip

Custom components in `src/ui/custom/`: DaysCounter, MarkdownFormat, InputArray, ColorPicker, MultiSelectCheckbox

## Key Component APIs

### Button (`@/ui/button`)
- Variants: `default | warning | destructive | outline | secondary | ghost | link`
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

## Data Loading Hooks (`src/utils/`)

No global state manager. Use these custom hooks for async data:

| Hook | When to use | States |
|---|---|---|
| `useLoadableData(apiFn, params)` | Eager-load on mount | `loading → loaded \| error` |
| `useReloadableData(apiFn, params)` | Need `reload()` and `setData()` | `loading → loaded \| reloading \| error` |
| `useLazyLoadableData(apiFn)` | Load on demand (user action) | `not_requested → loading → loaded \| error` |
| `usePollableData(apiFn, interval)` | Interval-based refetching | same as loadable |

All hooks return `{ state, ... }` where `state.type` is a discriminated union. Always handle with `switch (state.type)` + `default: notReachable(state)`.

### Rendering pattern for loadable data
```tsx
const { state, reload } = useLoadableData(getItems, params);

switch (state.type) {
  case 'loading':
    return <Spinner />;            // or Skeleton

  case 'loaded':
    return <ItemsList data={state.data} />;

  case 'error':
    return <ErrorMessage />;

  default:
    return notReachable(state);    // exhaustive check — always include
}
```

For `useReloadableData`, also handle `case 'reloading':` (show existing data + loading indicator).
For `useLazyLoadableData`, also handle `case 'not_requested':` (show trigger button/initial state).

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
import { useLoadableData } from '@/utils/useLoadableData';
import { useReloadableData } from '@/utils/useReloadableData';
import { useLazyLoadableData } from '@/utils/useLazyLoadableData';
```
