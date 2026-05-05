# OUTVUE™ – Growth Intelligence Platform · Frontend

Production-ready React 19 + TypeScript SPA.
Modern, responsive UI with data-rich dashboards, interactive charts, role-aware
navigation, and full feature-gating tied to subscription tiers.

---

## Tech Stack

| Concern       | Library / Version                                                                     |
| ------------- | ------------------------------------------------------------------------------------- |
| UI Framework  | React 19 + TypeScript 5.9                                                             |
| Build Tool    | Vite 8 (HMR, lazy code-splitting)                                                     |
| Styling       | TailwindCSS 3 (oklch colour tokens, custom design system)                             |
| Global State  | Redux Toolkit (auth slice with localStorage persistence)                              |
| Server State  | TanStack React Query 5 (queries, mutations, cache invalidation)                       |
| Routing       | React Router 7 (lazy-loaded routes, protected guards)                                 |
| HTTP          | Axios (JWT interceptors, silent auto-refresh on 401, request queue)                   |
| Forms         | React Hook Form + Zod resolvers                                                       |
| Charts        | Recharts 3 (area, bar, pie, dual-axis, custom tooltips)                               |
| Icons         | Lucide React                                                                          |
| Toasts        | Sonner                                                                                |
| UI Primitives | Shadcn-style components (Card, Button, Input, Label, Select, Skeleton, Badge, Dialog) |
| Font          | Inter variable                                                                        |

---

## Project Structure

```
src/
├── App.tsx                              ← Route declarations (all pages lazy-loaded)
├── main.tsx                             ← Entry point (providers, store, query client)
├── index.css                            ← Tailwind + oklch design tokens
│
├── app/
│   ├── hooks.ts                         ← useAppDispatch / useAppSelector typed hooks
│   ├── queryClient.ts                   ← React Query client configuration
│   ├── store.ts                         ← Redux store
│   ├── layouts/
│   │   ├── AppLayout.tsx                ← Sidebar + Topbar + <Outlet> shell
│   │   ├── Sidebar.tsx                  ← Collapsible, role-aware navigation
│   │   ├── Topbar.tsx                   ← Header bar
│   │   └── menu.ts                      ← Nav menu config (role-filtered)
│   └── router/
│       ├── RequireAuth.tsx              ← Auth guard (redirects to /login or /onboarding)
│       └── RequireRole.tsx              ← Role guard (Admin-only routes)
│
├── components/
│   ├── mode-toggle.tsx                  ← Dark / light mode toggle
│   ├── theme-provider.tsx               ← Theme context
│   └── ui/                             ← Shadcn-style primitives
│       ├── badge.tsx
│       ├── button.tsx
│       ├── card.tsx
│       ├── input.tsx
│       ├── label.tsx
│       ├── select.tsx
│       ├── separator.tsx
│       ├── skeleton.tsx
│       └── sonner.tsx
│
├── lib/
│   └── utils.ts                         ← cn() class-merge helper
│
├── modules/                            ← One folder per feature domain
│   ├── auth/                            ← Phase 1  · Login, Register, Forgot/Reset Password
│   │   ├── api/authApi.ts
│   │   ├── authSlice.ts                 ← Redux slice (access token, refresh token, user)
│   │   ├── hooks/useAuth.ts
│   │   ├── pages/  LoginPage · RegisterPage · ForgotPasswordPage · ResetPasswordPage
│   │   └── types/types.ts
│   │
│   ├── onboarding/                      ← Phase 2  · Multi-step business profile wizard
│   │   ├── api/ · hooks/ · pages/OnboardingPage
│   │
│   ├── marketing-spend/                 ← Phase 3  · Data table, create/edit dialog, CSV upload
│   │   ├── api/ · components/ · hooks/ · pages/MarketingSpendPage · types/
│   │
│   ├── bd-activity/                     ← Phase 3  · BD activity CRUD table + dialog
│   │   ├── api/ · components/ · hooks/ · pages/BdActivityPage · types/
│   │
│   ├── operational-cost/                ← Phase 3  · Operational cost CRUD table + dialog
│   │   ├── api/ · components/ · hooks/ · pages/OperationalCostPage · types/
│   │
│   ├── revenue-data/                    ← Phase 3  · Revenue data CRUD table + dialog
│   │   ├── api/ · components/ · hooks/ · pages/RevenueDataPage · types/
│   │
│   ├── ad-accounts/                     ← Phase 4+5 · Connect accounts, trigger sync, sync status
│   │   ├── api/  adAccountApi · syncApi
│   │   ├── components/ConnectAccountDialog
│   │   ├── hooks/ · pages/AdAccountsPage · types/
│   │
│   ├── dashboard/                       ← Phase 6  · KPI cards, trend chart, platform table, budget view
│   │   ├── api/ · hooks/ · pages/  DashboardPage · TrendsPage
│   │
│   ├── budget/                          ← Phase 6  · Current vs recommended allocation table
│   │   ├── api/ · hooks/ · pages/BudgetPage
│   │
│   ├── ecosystem/                       ← Phase 7  · Ecosystem & relationship-led BD
│   │   ├── api/ · hooks/ · pages/EcosystemPage
│   │
│   ├── comparison/                      ← Phase 8  · Side-by-side comparison (best=green, worst=red)
│   │   ├── api/ · hooks/ · pages/ComparisonPage
│   │
│   ├── insights/                        ← Phase 9  · AI recommendations list + priority badges
│   │   ├── api/ · hooks/ · pages/InsightsPage
│   │
│   ├── actions/                         ← Phase 10 · Action plan list, status filter, outcome notes
│   │   ├── api/ · hooks/ · pages/ActionsPage
│   │
│   ├── scenarios/                       ← Phase 11 · What-if builder, projected metrics, bar chart
│   │   ├── api/ · hooks/ · pages/ScenariosPage
│   │
│   ├── review/                          ← Phase 12 · Monthly review, month/year picker
│   │   ├── api/ · hooks/ · pages/ReviewPage
│   │
│   ├── billing/                         ← Phase 13 · Tier cards, checkout, cancel, pilot conversion
│   │   ├── api/ · hooks/ · pages/BillingPage
│   │
│   ├── reports/                         ← Phase 14 · CSV + PDF download with date/platform filters
│   │   ├── api/ · hooks/ · pages/ReportsPage
│   │
│   ├── admin/                           ← Phase 15 · Admin-only users table + revenue metrics
│   │   ├── api/ · hooks/ · pages/  AdminUsersPage · AdminRevenuePage
│   │
│   ├── compliance/                      ← Cross-cutting · Disclaimer, GDPR notice, audit log
│   │   ├── api/ · hooks/ · pages/CompliancePage
│   │
│   └── settings/                       ← Self-service · Profile, password, GDPR export (3-tab page)
│       ├── api/settingsApi.ts
│       ├── hooks/useSettings.ts
│       └── pages/SettingsPage.tsx
│
├── pages/
│   └── NotFoundPage.tsx                ← Branded 404 with back-to-dashboard link
│
└── shared/
    ├── api/http.ts                      ← Axios instance, 401 interceptor, auto-refresh queue,
    │                                       getApiErrorMessage() helper
    └── components/
        ├── CsvUploadButton.tsx          ← Reusable CSV file upload + preview
        ├── ErrorBoundary.tsx
        ├── PageLoader.tsx               ← Full-page spinner (used as Suspense fallback)
        └── PlaceholderPage.tsx          ← Generic "coming soon" (no longer used in routing)
```

Each module follows the same pattern:

```
api/         →  Typed functions calling shared Axios instance (return unwrapped data)
hooks/       →  React Query useQuery / useMutation with cache invalidation + toast feedback
pages/       →  Route-level components consuming hooks
components/  →  Module-scoped dialogs, filters, tables (present where needed)
types/       →  TypeScript interfaces for the module
```

---

## Routes & Pages

| Route                | Page                              | Phase | Status  |
| -------------------- | --------------------------------- | ----- | ------- |
| `/login`             | LoginPage                         | 1     | ✅ Done |
| `/register`          | RegisterPage                      | 1     | ✅ Done |
| `/forgot-password`   | ForgotPasswordPage                | 1     | ✅ Done |
| `/reset-password`    | ResetPasswordPage                 | 1     | ✅ Done |
| `/onboarding`        | OnboardingPage                    | 2     | ✅ Done |
| `/dashboard`         | DashboardPage                     | 6     | ✅ Done |
| `/data/marketing`    | MarketingSpendPage                | 3     | ✅ Done |
| `/data/bd`           | BdActivityPage                    | 3     | ✅ Done |
| `/data/operational`  | OperationalCostPage               | 3     | ✅ Done |
| `/data/revenue`      | RevenueDataPage                   | 3     | ✅ Done |
| `/accounts`          | AdAccountsPage                    | 4+5   | ✅ Done |
| `/analytics/trends`  | TrendsPage                        | 6     | ✅ Done |
| `/analytics/compare` | ComparisonPage                    | 8     | ✅ Done |
| `/insights`          | InsightsPage (AI recommendations) | 9     | ✅ Done |
| `/scenarios`         | ScenariosPage                     | 11    | ✅ Done |
| `/billing`           | BillingPage                       | 13    | ✅ Done |
| `/reports`           | ReportsPage                       | 14    | ✅ Done |
| `/ecosystem`         | EcosystemPage                     | 7     | ✅ Done |
| `/actions`           | ActionsPage                       | 10    | ✅ Done |
| `/review`            | ReviewPage                        | 12    | ✅ Done |
| `/budget`            | BudgetPage                        | 6     | ✅ Done |
| `/compliance`        | CompliancePage                    | —     | ✅ Done |
| `/admin/users`       | AdminUsersPage                    | 15    | ✅ Done |
| `/admin/revenue`     | AdminRevenuePage                  | 15    | ✅ Done |
| `/settings`          | SettingsPage (3 tabs)             | —     | ✅ Done |
| `/settings/profile`  | SettingsPage → Profile tab        | —     | ✅ Done |
| `/settings/account`  | SettingsPage → Security tab       | —     | ✅ Done |
| `*` (any unknown)    | NotFoundPage                      | —     | ✅ Done |

All protected routes wrapped in `<RequireAuth>` and rendered inside `<AppLayout>` (sidebar + topbar shell).
Admin routes additionally wrapped in `<RequireRole role="Admin">`.

---

## Auth Flow

- Access token stored in Redux (memory + localStorage)
- Refresh token sent in request body on `/auth/refresh`
- Axios request interceptor attaches `Authorization: Bearer <token>`
- Axios response interceptor catches 401 → silently calls refresh → retries original request
- Queued requests during refresh are held and replayed after new token is issued
- On refresh failure → `clearAuth()` dispatched → redirect to `/login`
- `RequireAuth` redirects to `/onboarding` if `isOnboarded === false`

---

## Setup

```bash
npm install
npm run dev        # http://localhost:5173
npm run build      # production build (TypeScript check + Vite)
npm run preview    # preview production build locally
```

Dev server proxies `/api/*` to `http://localhost:5000` (configure in `vite.config.ts`).

---

## ✅ What Is Complete

| Phase          | Feature                                                                                                                                                                                                                | Done |
| -------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ---- |
| **Phase 1**    | Login, Register, Forgot Password, Reset Password pages with React Hook Form + Zod validation                                                                                                                           | ✅   |
| **Phase 1**    | Redux auth slice with localStorage persistence, typed `useAppSelector` / `useAppDispatch`                                                                                                                              | ✅   |
| **Phase 1**    | Axios interceptor with 401 → auto-refresh → retry queue (no request lost during token rotation)                                                                                                                        | ✅   |
| **Phase 2**    | Onboarding wizard — multi-step business profile form, sets `isOnboarded` flag, redirected to from `RequireAuth`                                                                                                        | ✅   |
| **Phase 3**    | MarketingSpendPage — paginated table, create/edit dialog, delete, filters                                                                                                                                              | ✅   |
| **Phase 3**    | BdActivityPage — paginated table, create/edit dialog, delete, filters                                                                                                                                                  | ✅   |
| **Phase 3**    | OperationalCostPage — paginated table, create/edit dialog, delete, filters                                                                                                                                             | ✅   |
| **Phase 3**    | RevenueDataPage — paginated table, create/edit dialog, delete, filters                                                                                                                                                 | ✅   |
| **Phase 3**    | `CsvUploadButton` shared component for bulk CSV import                                                                                                                                                                 | ✅   |
| **Phase 4+5**  | AdAccountsPage — connect dialog, platform list, disconnect, trigger sync, sync status                                                                                                                                  | ✅   |
| **Phase 6**    | DashboardPage — KPI cards (total spend, leads, CPL, best channel), area trend chart, platform table, budget allocation panel, top-3 AI insights panel, date range + platform filters                                   | ✅   |
| **Phase 6**    | TrendsPage — time-series line chart (daily spend + leads)                                                                                                                                                              | ✅   |
| **Phase 6**    | BudgetPage — current vs recommended % allocation table                                                                                                                                                                 | ✅   |
| **Phase 7**    | EcosystemPage — ecosystem activity log, CRUD, summary stats                                                                                                                                                            | ✅   |
| **Phase 8**    | ComparisonPage — side-by-side table, best value highlighted green, worst red, sortable columns                                                                                                                         | ✅   |
| **Phase 9**    | InsightsPage — recommendations list, priority badges (High=red, Medium=amber, Low=green), disclaimer banner, dismiss / action controls                                                                                 | ✅   |
| **Phase 10**   | ActionsPage — action list, status filter, mark complete with outcome, linked recommendation shown                                                                                                                      | ✅   |
| **Phase 11**   | ScenariosPage — add/remove channel adjustment rows, run model, projected vs current metric cards with delta badges, bar chart                                                                                          | ✅   |
| **Phase 12**   | ReviewPage — month/year picker, perf vs prior period, actions taken/pending, opportunities, inefficiencies                                                                                                             | ✅   |
| **Phase 13**   | BillingPage — tier cards (Starter / Professional / Growth / Enterprise), monthly/annual toggle, current plan status badge, checkout, cancel, pilot conversion, feature list per tier                                   | ✅   |
| **Phase 14**   | ReportsPage — CSV download, PDF download, date range + platform filter controls                                                                                                                                        | ✅   |
| **Phase 15**   | AdminUsersPage — users table with subscription status (Admin only)                                                                                                                                                     | ✅   |
| **Phase 15**   | AdminRevenuePage — MRR, ARR, churn, LTV metrics, revenue by tier chart (Admin only)                                                                                                                                    | ✅   |
| **Compliance** | CompliancePage — disclaimer, UK GDPR notice, data-source record counts, audit log with acknowledge                                                                                                                     | ✅   |
| **Settings**   | SettingsPage — **Profile tab** (name + business type, email shown read-only), **Security tab** (current + new password + confirm, validated), **Data & Privacy tab** (GDPR rights notice + one-click JSON data export) | ✅   |
| **404**        | NotFoundPage — branded 404 with back-to-dashboard link, wired to `*` catch-all route                                                                                                                                   | ✅   |

---

## 🔲 What Remains (Within Spec Scope)

| #   | Spec Requirement                             | Gap                                                                                                                                                                                                                                                                                                                | Priority   |
| --- | -------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | ---------- |
| 1   | **multer CSV file upload (multipart)**       | `CsvUploadButton` component exists and the UI is present on data-input pages, but the backend `/bulk` endpoints currently expect pre-parsed JSON rows rather than a raw multipart file. `multer` needs to be installed on the backend and the frontend upload needs to POST `multipart/form-data` instead of JSON. | **High**   |
| 2   | **FeatureGate component**                    | Spec requires a `FeatureGate.tsx` that wraps locked features with a preview overlay and an upgrade button when the user's tier does not include the feature. Billing tier is available in Redux but no reusable gate component exists — pages do not currently lock or blur content based on `subscriptionTier`.   | **High**   |
| 3   | **Notification preferences tab in Settings** | Spec lists notification preferences as a Settings page section. The current SettingsPage has Profile, Security, and Data & Privacy tabs only. No notification preference UI or backend storage exists.                                                                                                             | **Low**    |
| 4   | **In-product upgrade nudges**                | Spec requires: when a user hits a feature limit, show an inline upgrade prompt with a locked preview and upgrade button. Currently the BillingPage lists features per tier but no contextual nudge appears within the feature pages themselves.                                                                    | **Medium** |
| 5   | **DisclaimerBanner component**               | Spec calls for a reusable `DisclaimerBanner.tsx` shown on the InsightsPage and any page showing AI output. The disclaimer text is present in the API response and displayed on CompliancePage, but there is no shared banner component wrapping the insights / dashboard panels.                                   | **Low**    |
| 6   | **DateRangePicker component**                | Spec requires a dedicated `DateRangePicker.tsx` component. Date filtering is currently handled with plain `<input type="date">` fields inline in page components rather than a shared, reusable picker.                                                                                                            | **Low**    |
| 7   | **PlatformFilter component**                 | Spec requires a reusable `PlatformFilter.tsx`. Platform selection is currently implemented inline per page.                                                                                                                                                                                                        | **Low**    |
| 8   | **Spec route naming**                        | Spec defines `/recommendations` (vs current `/insights`), `/compare` (vs `/analytics/compare`), `/connected-accounts` (vs `/accounts`), `/data-input` single-page with 4 tabs (vs 4 separate routes). All pages are implemented — only the URL paths differ from spec.                                             | Cosmetic   |

---

## Key Patterns

**Data fetching** — Every module uses React Query. Mutations automatically invalidate related queries. Loading uses `<Skeleton>` components. Empty tables use an empty-state message. Errors show toast via Sonner.

**Forms** — React Hook Form + Zod resolvers. Client-side validation fires before any API call. API errors are extracted with `getApiErrorMessage()` and shown as toast.

**Code splitting** — Every page is `React.lazy()` wrapped. Suspense fallback is `<PageLoader>` (full-screen spinner).

**Design system** — oklch colour tokens in CSS variables. Dark / light mode toggle. Inter variable font. Consistent 4px grid spacing.

**Role-awareness** — Sidebar menu filtered by `req.user.role`. Admin-only pages (admin/users, admin/revenue) reject non-Admin users via `<RequireRole>`.
