# Codebase Map

Use this to navigate directly to the right module/file instead of scanning the project.

## Top-level

| Path | Purpose |
|---|---|
| `src/App.tsx` | Root app component |
| `src/main.tsx` | Entry point |
| `src/routing/components/AppRoutes.tsx` | All route definitions |
| `src/routing/components/InternalElement.tsx` | Authenticated route wrapper |

## Modules (`src/modules/`)

Each module follows the pattern: `api/`, `components/`, `pages/`, `types/`, and optionally `contexts/`, `guards/`, `helpers/`, `data/`, `utils/`.

### Core

| Module | Purpose | Key files |
|---|---|---|
| `api/` | Shared Axios instance | `api.ts` — base config, interceptor, `setApiAuth()` |
| `config/` | Environment config | `index.ts` — Zod-validated `ENV` object |
| `auth/` | Authentication | `contexts/AuthSessionContext.tsx`, `contexts/UserContext.tsx`, `guards/AuthGuard.tsx`, `api/getUser.ts` |
| `supabase/` | Supabase client | `client.ts` |

### Project hierarchy: Projects → Phases → Milestones → Tasks

| Module | Purpose | Types | API endpoints |
|---|---|---|---|
| `projects/` | Project CRUD, status, forms | `types/entity.ts` — `ProjectPreviewEntity`, `ProjectEntity`, `ProjectSoul`, `ProjectStatus`; `components/ProjectPageLoader.tsx` — reusable project loader with loading/error states, provides `{ project, reload, setProject }` | `getProjects`, `getProject`, `createProject`, `updateProject`, `deleteProject`, `startProject`, `unlockProject`, `getProjectProgress` |
| `phases/` | Phase management within projects | `types/entity.ts` | `getPhases`, `getPhase`, `startPhase`, `completePhase`, `modifyPhases` |
| `milestones/` | Milestone tracking within phases | `types/entity.ts` | `getMilestones`, `getMilestone`, `createMilestones`, `modifyMilestones`, `startMilestone`, `completeMilestone`, `toggleStep` |
| `tasks/` | Daily tasks within milestones | `types/entity.ts` | `getTasks`, `getActiveTasks`, `createTasks`, `completeTask` |

### Feature modules

| Module | Purpose | Key components |
|---|---|---|
| `chat/` | Project-scoped AI chat with SSE streaming | `ChatPage` (list), `ChatViewPage` (single chat), `ChatConversation`, `ChatMessageBubble`, `ChatInput`, `useChatStream` |
| `dashboard/` | Main project dashboard | `DashboardPage`, `DashboardShaping`, `WelcomeModal`, `ChatsTable`, `RoadmapPage` |
| `shaping/` | AI-driven project shaping conversation | `ShapingModal`, `ShapingForm`, `ShapingChatForm`, `ShapingSummary`, `SummaryReview` |
| `soul/` | Project soul visualization & queue | `SoulBlock`, `SoulQueueSnackbar`, `SoulActionButtons`, `WorkstreamsPage`, `DecisionsPage`, `OpenQuestionsPage`, `AssumptionsPage`, `api/addToSoulQueue`, `api/removeFromSoulQueue`, `api/applySoulQueue` |
| `timeline/` | Daily timeline & history | `TodayTimelineLoader`, `HistoryTimelineLoader`, `Timeline`, `FocusComment`, `StartNewMilestoneForm` |
| `subscriptions/` | Billing, pricing, Stripe | `PricingCards`, `UpgradeSubscriptionModal`, `ActiveProjectGuard`, `data/prices.ts` |
| `home/` | Public landing pages | `HomePage`, `PricingPage`, `StaticPage` (terms/privacy) |
| `competitors/` | Competitor analysis | `CompetitorsLoader` |
| `auditory/` | Audience/auditory analysis | `AuditoryContent`, `AuditoryLoader` |
| `analytics/` | Page view tracking | `AnalyticsTracker`, `utils/pageview.ts` |
| `transcription/` | Real-time audio transcription | `TranscriptionListener`, `TranscriptionLoader`, WebRTC utils |
| `microphone/` | Microphone access | `MicrophoneConnector`, `MicrophoneContext` |
| `tts/` | Text-to-speech audio | `AudioQueueContext`, `AudioQueueController` |
| `users/` | User account | `AccountPage`, `types/user.ts` |
| `templates/` | Shared page layouts | `PageTemplate`, `PageLoader` |

## UI (`src/ui/`)

| Path | What's there |
|---|---|
| `src/ui/*.tsx` | Shadcn/UI primitives (button, card, badge, dialog, etc.) |
| `src/ui/custom/` | Composed components (DaysCounter, MarkdownFormat, InputArray, ColorPicker, MultiSelectCheckbox) |
| `src/ui/components/` | App shell components (sidebar, nav, header, section-cards, data-table) |
| `src/ui/hooks/` | `use-mobile.ts` |
| `src/ui/lib/utils.ts` | `cn()` helper (clsx + tailwind-merge) |

## Data Layer (`src/lib/`)

TanStack Query (v5) shared cache. Adapter hooks return the same discriminated union types as the old `src/utils/` hooks, so consumer components use the same `switch (state.type)` pattern.

| File | Purpose |
|---|---|
| `queryClient.ts` | `QueryClient` singleton (staleTime: 30s, gcTime: 5min, retry: 1) |
| `queryKeys.ts` | Centralized query key factory (`queryKeys.projects.detail(id)`, etc.) |
| `invalidationMap.ts` | Mutation → query key invalidation rules |
| `types.ts` | Discriminated union types: `LoadableData`, `ReloadableData`, `LazyLoadableData`, `PollingData` |
| `adapters/useLoadableQuery.ts` | Wraps `useQuery` → `LoadableData` + `reload()` |
| `adapters/useReloadableQuery.ts` | Wraps `useQuery` → `ReloadableData` + `reload()` + `setData()` |
| `adapters/usePollingQuery.ts` | Wraps `useQuery` with `refetchInterval` → `PollingData` + `stopPolling()`/`continuePolling()` |
| `adapters/useLazyMutation.ts` | Wraps `useMutation` → `LazyLoadableData` + `load()` + `reset()`, accepts `invalidateKeys` |
| `adapters/index.ts` | Barrel export |

## Utilities (`src/utils/`)

| File | Purpose |
|---|---|
| `notReachable.ts` | Exhaustive switch/if-else helper |
| `useLoadableData.ts` | **Legacy** — still used by mutation-on-mount components (`MilestonesBuilder`, `TasksBuilder`, etc.) |
| `useReloadableData.ts` | **Legacy** — replaced by `useReloadableQuery` from `@/lib/adapters` |
| `useLazyLoadableData.ts` | **Legacy** — replaced by `useLazyMutation` from `@/lib/adapters` |
| `usePollableData.ts` | **Legacy** — replaced by `usePollingQuery` from `@/lib/adapters` |
| `cancelable.ts` | **Legacy** — TanStack Query handles abort via `signal` parameter |
| `replaceUnicode.ts` | Unicode character replacement |
| `formatPrice.ts` | Price formatting |

## Common search shortcuts

| Looking for... | Go to |
|---|---|
| Route definitions | `src/routing/components/AppRoutes.tsx` |
| API base config | `src/modules/api/api.ts` |
| Environment variables | `src/modules/config/index.ts` |
| Auth context/session | `src/modules/auth/contexts/` |
| Project types/schemas | `src/modules/projects/types/entity.ts` |
| Any entity type | `src/modules/<module>/types/entity.ts` |
| Any API call | `src/modules/<module>/api/` |
| Query keys | `src/lib/queryKeys.ts` |
| Cache invalidation rules | `src/lib/invalidationMap.ts` |
| Data loading types | `src/lib/types.ts` |
| Data loading hooks | `src/lib/adapters/` |
| Shared page layout | `src/modules/templates/components/PageTemplate.tsx` |
| Theme/colors | `src/index.css` |
| Tailwind config | `vite.config.ts` (Tailwind 4 uses Vite plugin) |
