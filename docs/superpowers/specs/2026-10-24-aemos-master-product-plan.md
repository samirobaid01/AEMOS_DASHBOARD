# AEMOS Master Product + Engineering Plan (Improved)
**Date:** 2026-10-24  
**Author:** samirobaid01  
**Basis:** Post-code-inspection revision of the original senior architect brief

---

## 0. What This Document Is

This is the revised engineering and product plan for evolving AEMOS into a
public IoT platform. It supersedes the original brief by grounding every
claim in the actual codebase — file paths, existing features, confirmed tech
stack. Where the original plan proposed building things that already exist,
or skipped problems that actually exist in the code, this document corrects
both.

**Repositories:**
- Frontend: `https://github.com/samirobaid01/AEMOS_DASHBOARD` (this repo)
- Backend: `https://github.com/samirobaid01/AEMOSBACKEND`

---

## 1. Actual Architecture (confirmed by code inspection)

### 1.1 Frontend Stack

| Layer | Technology | Version | File |
|---|---|---|---|
| Framework | React | 19.1 | `src/main.tsx` |
| Language | TypeScript | 5.8 | `tsconfig.app.json` |
| Bundler | Vite | 6.3 | `vite.config.ts` |
| State | Redux Toolkit | 2.8 | `src/state/store.ts` |
| Routing | React Router DOM | 7.5 | `src/routes/routes.tsx` |
| HTTP client | Axios | 1.9 | `src/services/api/apiClient.ts` |
| Real-time | Socket.io client | 4.8 | `src/hooks/useTelemetrySocket.ts` |
| UI library | MUI | 7.1 | throughout |
| Styling | Tailwind CSS | 3.4 | `tailwind.config.js` |
| Analytics | Mixpanel | 2.64 | `src/services/mixpanel.service.ts` |
| i18n | i18next | 25.1 | `src/i18n/` |
| Validation | Yup + React Hook Form | 1.6 / 5 | throughout |
| Notifications | React Toastify | 11 | throughout |

**Design system note:** The app uses two parallel styling systems —
MUI v7 and Tailwind CSS. Components use each inconsistently. This is
existing tech debt that must be addressed before a public launch.

### 1.2 Confirmed Routes (all behind PrivateRoute by default)

```
/                   → redirect to /login
/login              PublicRoute
/signup             PublicRoute
/forgot-password    PublicRoute
/dashboard          PrivateRoute
/organizations      PrivateRoute + permission: organization.view
/organizations/create            organization.create
/organizations/:id               organization.view
/organizations/:id/edit          organization.update
/areas              area.view / area.create / area.update
/sensors            sensor.view / sensor.create / sensor.update
/devices            device.view / device.create / device.update
/rule-engine        rule.view / rule.create / rule.update
/telemetry          PrivateRoute (no specific permission)
/profile            PrivateRoute
/settings           PrivateRoute
/debug/socket-tester             (development only — not guarded)
/debug/device-state-test         (development only — not guarded)
```

### 1.3 Redux State Slices

| Slice | File |
|---|---|
| auth | `src/state/slices/auth.slice.ts` |
| organizations | `src/state/slices/organizations.slice.ts` |
| areas | `src/state/slices/areas.slice.ts` |
| sensors | `src/state/slices/sensors.slice.ts` |
| devices | `src/state/slices/devices.slice.ts` |
| deviceStates | `src/state/slices/deviceStates.slice.ts` |
| deviceDetails | `src/state/slices/deviceDetails.slice.ts` |
| deviceStateInstances | `src/state/slices/deviceStateInstances.slice.ts` |
| ruleEngine | `src/state/slices/ruleEngine.slice.ts` |

### 1.4 Real-time Hooks

| Hook | Purpose | File |
|---|---|---|
| `useTelemetrySocket` | Single sensor telemetry streaming via socket rooms | `src/hooks/useTelemetrySocket.ts` |
| `useMultiTelemetry` | Multi-entity (sensor+device) streaming with dynamic room management | `src/hooks/useMultiTelemetry.ts` |
| `useDeviceStateSocket` | Device state change notifications | `src/hooks/useDeviceStateSocket.ts` |

### 1.5 API Client Pattern

- Base URL: `VITE_API_URL` env var, defaults to `http://localhost:3000/api/v1/`
- Auth: Bearer token injected from Redux state on every request
- **Token refresh: NOT IMPLEMENTED** — 401 just dispatches `clearCredentials` and redirects to `/login`
- Tokens stored in `localStorage` under `aemos_token` and `aemos_refresh_token`

### 1.6 Config / Environment Variables (frontend)

| Variable | Purpose | Default |
|---|---|---|
| `VITE_API_URL` | REST API base URL | `http://localhost:3000/api/v1/` |
| `VITE_SOCKET_URL` | Socket.io server URL | `http://localhost:3000` |
| `VITE_MIXPANEL_TOKEN` | Mixpanel analytics token | `""` (disabled if empty) |
| `VITE_ENABLE_TELEMETRY_PERSISTENCE` | Feature flag | `"true"` |

**Gap:** No `.env.example` file exists. Anyone cloning the repo has no
documentation of what vars to set.

---

## 2. Feature Status Matrix

Status labels: **✅ Implemented** / **⚡ Partial** / **❌ Missing** / **🚫 Not needed yet**

| Feature | Status | Notes |
|---|---|---|
| Auth (login/signup/logout/forgot-pw) | ✅ | JWT + refresh token |
| Token refresh on 401 | ❌ | Just logs out |
| Granular permission routing | ✅ | `organization.view`, `device.create`, etc. |
| Organization CRUD | ✅ | Full CRUD with details |
| Area CRUD | ✅ | Full CRUD with details |
| Sensor CRUD | ✅ | Full CRUD with details |
| Device CRUD + state management | ✅ | Includes `DeviceStateManager`, `DeviceStatesModal` |
| Rule Engine (node-based) | ✅ | `RuleChain` + `RuleNode` with filter/action; links to sensors/devices |
| Telemetry table view | ✅ | Filtering by org/area/sensor/device |
| Real-time telemetry (socket) | ✅ | Room-based subscriptions, new-datastream events |
| Time-series charts | ❌ | Only a table; no historical charts |
| Dashboard (StatCards) | ⚡ | Cards exist; real data wiring unclear |
| Walkthrough/onboarding | ⚡ | `DashboardWalkthrough` registered; needs completion |
| Dark mode | ⚡ | Tailwind tokens defined; not consistently applied |
| i18n (en/es) | ✅ | i18next initialized |
| Mixpanel analytics | ✅ | Token-gated; track/identify/setPeople |
| Landing page | ❌ | Root redirects to `/login` |
| Anonymous trial | ❌ | Everything requires login |
| Trial → account conversion | ❌ | Not started |
| Billing / plan enforcement | ❌ | Not started |
| Usage metering | ❌ | Not started |
| Tests (any) | ❌ | Zero test files |
| CI/CD pipeline | ❌ | No GitHub Actions |
| `.env.example` | ❌ | No documentation of required vars |
| Debug routes in production | ⚠️ | `/debug/*` not guarded; remove or flag-gate |

---

## 3. Critical Issues (must fix before public launch)

These are not future features — they are current defects that create
security, privacy, or reliability risks.

### 3.1 Security: Console Leakage

**Severity: High**

The following files emit sensitive data to the browser console in
production code:

| File | What is logged |
|---|---|
| `src/state/slices/auth.slice.ts` | User permissions, auth state, tokens |
| `src/routes/PrivateRoute.tsx` | Authentication status, permission checks |
| `src/hooks/useTelemetrySocket.ts` | Socket connection, ALL received events via `socket.onAny` |
| `src/hooks/useMultiTelemetry.ts` | Socket join/leave, entity data |
| `src/components/dashboard/DashboardWalkthrough.tsx` | Walkthrough state |

**Fix:** Wrap all `console.log`/`console.error` calls in `IS_DEV` guards
or remove them. The `socket.onAny` debug listener must be removed entirely.

### 3.2 Security: JWT in localStorage

**Severity: Medium**

Auth tokens in `localStorage` are readable by any JavaScript on the
page. If an XSS vulnerability is ever introduced, tokens are stolen.

**Options:**
1. Move to `httpOnly` cookies (requires backend changes to set cookies)
2. Keep in memory only (no persistence; user re-authenticates on refresh)
3. Keep in localStorage but ensure strict CSP headers

The current FE implementation at `src/services/api/apiClient.ts` reads
the token from Redux state, which is sourced from `localStorage`. This
chain needs to match whatever the BE can support.

**Recommendation:** Discuss with backend owner. Document the decision in
`docs/SECURITY_THREATS.md`.

### 3.3 Security: No Token Refresh

**Severity: High**

`src/services/api/apiClient.ts` lines 41–51: on 401, the client
immediately clears credentials and redirects. There is a `_retry` flag
placeholder but the actual refresh call is missing (`// Here you would
typically refresh the token`).

**Fix:** Implement token refresh using `REFRESH_TOKEN_STORAGE_KEY`.
Queue concurrent requests while refresh is in flight. Only logout if the
refresh itself fails.

### 3.4 Security: Unguarded Debug Routes

**Severity: Medium**

`/debug/socket-tester` and `/debug/device-state-test` are behind
`PrivateRoute` (authentication required) but they expose internal socket
and device state debug tools to any authenticated user. They should be
removed from the production build or gated behind an admin permission
or an `IS_DEV` check.

### 3.5 Privacy: Mixpanel in localStorage Persistence Mode

`src/services/mixpanel.service.ts`: `persistence: 'localStorage'`
stores Mixpanel identity data in the user's browser indefinitely.
Before public launch, verify this is disclosed in the privacy policy
and review whether `'cookie'` or `'memory'` persistence would be more
appropriate.

---

## 4. Tech Debt (address as part of each phase, not a separate big-bang)

| Item | File(s) | Action |
|---|---|---|
| Dual design system (MUI + Tailwind) | throughout `src/components/` | Decide which system owns which layer; document the boundary |
| Typo in BE field name `recievedAt` | `src/hooks/useTelemetrySocket.ts` | Will be fixed when BE normalizes the field; track with a `// FIXME: BE typo` comment |
| Duplicate `.ts` and `.d.ts` type files | `src/types/*.ts` and `src/types/*.d.ts` | Merge: use `.d.ts` for pure type declarations, remove re-export wrappers |
| Empty `src/state/services/` directory | `src/state/services/` | Either populate with RTK Query services or remove |
| Stale commented imports in `store.ts` | `src/state/store.ts` lines 14–15 | Remove |
| `_retry?: boolean` type hack on AxiosRequestConfig | `src/services/api/apiClient.ts` | Replace with a typed extension interface |

---

## 5. Non-Negotiable Working Rules (revised and expanded)

1. **Read before touching.** Before changing any file, read it.
   Before proposing a change to a route, confirm it in `src/routes/routes.tsx`.
   Before adding a Redux action, check the relevant slice.
2. **Use the real model names.** The data model uses `Organization`
   (not workspace), `RuleChain`/`RuleNode` (not rule-chain-editor),
   `Sensor` (not data-source). Never invent names.
3. **No console.log in production paths.** Guard with `IS_DEV` from
   `src/config/index.ts` or remove entirely.
4. **One loading state per slice.** Do not add a new global `loading`
   boolean per async thunk if the slice already has one.
5. **Tailwind for layout/spacing, MUI for complex interactive
   components (DataGrid, Dialog, Select) until the design system is
   consolidated.** Document exceptions.
6. **No `.env` files committed.** Maintain `/.env.example` with
   placeholder values for all `VITE_*` variables.
7. **Tests are not optional from Phase 1 onward.** Every new feature
   gets at minimum a unit test for business logic and an integration
   test for the API contract.
8. **Feature flags gate unfinished UI.** If a UI element implies a
   feature that does not work, hide it or label it clearly. Never show
   a non-functional control without a label.
9. **Atomic database operations on the backend.** Any transfer of
   ownership (e.g., trial → account conversion) must use a transaction
   and lock. This must be verified in the BE code before the FE
   conversion flow is built.
10. **No payment activation without explicit owner approval.**
    Use Stripe test/sandbox mode through Phase 5.

---

## 6. Revised Phase Plan

### Phase 0 — Security Hardening and Baseline (start here)

**Why first:** The existing codebase ships to production with console
leakage and no token refresh. These must be fixed before any public
URL can go live.

**Scope:** Frontend only unless token strategy requires backend changes.

**Files to change:**
- `src/state/slices/auth.slice.ts` — remove all `console.log`
- `src/routes/PrivateRoute.tsx` — remove all `console.log`
- `src/hooks/useTelemetrySocket.ts` — remove `console.log`s and `socket.onAny`
- `src/hooks/useMultiTelemetry.ts` — remove `console.log`s
- `src/components/dashboard/DashboardWalkthrough.tsx` — remove `console.log`
- `src/services/api/apiClient.ts` — implement actual token refresh
- `src/routes/routes.tsx` — gate `/debug/*` with `IS_DEV` or admin permission
- Create `/.env.example` with all `VITE_*` variable placeholders

**New file:** `src/services/api/tokenRefresh.ts` — handles queued refresh
logic so concurrent 401 requests all wait for one refresh attempt.

**Acceptance:**
- `grep -r "console.log" src/` returns zero hits outside of `IS_DEV` guards
- `socket.onAny` removed from production code
- A 401 response triggers a token refresh attempt; only if that fails does
  the user see the login page
- Debug routes are removed from prod build or gated
- `.env.example` documents every variable

---

### Phase 0.5 — Test Infrastructure

**Why before features:** Adding tests after the fact is far more
expensive. Establish tooling now so every subsequent phase ships with tests.

**Stack:** Vitest (matches Vite, no extra config), React Testing Library,
MSW (mock service worker for API mocking in tests).

**Files to create/modify:**
- `vitest.config.ts` — Vitest configuration
- `src/test/setup.ts` — global test setup (jest-dom matchers, MSW init)
- `src/test/mocks/handlers.ts` — MSW request handlers
- Add `"test": "vitest"` script to `package.json`

**First tests to write:**
- `src/state/slices/auth.slice.test.ts` — permission checks, token storage
- `src/services/api/apiClient.test.ts` — token injection, 401 refresh flow
- `src/routes/PrivateRoute.test.tsx` — authenticated/unauthenticated render

**Acceptance:**
- `npm test` runs and all initial tests pass
- CI workflow (`.github/workflows/ci.yml`) runs lint + test + build on
  every PR

---

### Phase 1 — Landing Page and Design System Consolidation

**Scope:** Marketing page visible without login + design system decision.

**Design system decision (make before touching any component):**
Define which layer owns what:
- MUI: Dialog, Select, DataGrid, complex form fields, Date pickers
- Tailwind: All layout, spacing, color tokens, card shells, badges, typography

Document this in `docs/DESIGN_SYSTEM.md`. Every subsequent component follows
this boundary.

**Landing page:**
- New route `/` (remove the current `Navigate to="/login"`)
- New route `/login` remains as-is
- `src/containers/Landing/LandingPage.tsx` — new container
- `src/components/landing/` — new component directory

**Landing page content (honest):**
- What AEMOS does: IoT management — organize devices, stream telemetry,
  define alert rules, and visualize sensor data from one place
- Primary CTA: "Get started free" → `/signup`
- Secondary CTA: "See a live demo" → `/demo` (Phase 2)
- Feature highlights grounded in actual capabilities:
  - Device and sensor management (exists)
  - Real-time telemetry streaming (exists)
  - Rule engine for automated alerts and device commands (exists)
  - Multi-organization support (exists)
- No fake testimonials, no unverified performance claims
- Footer with links to privacy policy, terms, contact

**Dark mode:** The Tailwind config already defines dark tokens
(`background.dark`, `surface.dark`, etc.). The landing page and all
new components must use these consistently. Add a ThemeToggle component.

**Accessibility:** All buttons keyboard-accessible, focus rings visible,
images have alt text, color contrast meets WCAG AA.

**Responsive:** Mobile-first, 16px side gutters, hamburger nav at `sm`
breakpoint.

**Acceptance:**
- `/` renders without authentication
- `/login` and all existing authenticated routes still work
- Lighthouse accessibility score ≥ 90 on landing
- `npm run build` succeeds without new TypeScript errors

---

### Phase 2 — Demo Experience (anonymous, read-only)

**Scope:** Pre-authentication demo using seeded sample data. No real
devices. No account creation required.

**Route:** `/demo` (public, no auth required)

**Data strategy:**
- Demo data lives in a separate `DEMO_ORG_ID` environment variable pointing
  to a seeded read-only organization on the BE
- Alternatively: static JSON fixtures in `src/data/demo/` for a fully
  frontend-hosted demo. Use this if the BE cannot safely expose a read-only
  org without auth.
- Every view shows a `DemoBanner` component: "You are viewing sample data.
  No real devices are connected."

**Demo scenarios available (map to existing implemented features):**
- Environmental sensors (temperature, humidity) — uses existing Sensor + Telemetry views
- Device fleet overview — uses existing Device list
- Alert rule example — uses existing Rule Engine

**Never show:** real customer data, device credentials, API keys.

**Funnel events to track with existing Mixpanel setup:**
- `demo_started` — user lands on /demo
- `demo_entity_viewed` — user opens a device/sensor detail
- `signup_cta_clicked` — user clicks "Create free account"

**Acceptance:**
- `/demo` loads without login
- All data is clearly labeled as sample
- Demo data cannot be written to (all create/edit/delete controls hidden)
- `/demo` uses the same component library as the authenticated app; no
  duplicate pages

---

### Phase 3 — Anonymous Trial Session

This phase is intentionally described at spec level, not implementation
level, because the key invariants must be confirmed in the BE code before
any FE work starts.

**Before building the FE, verify in the BE:**
- Does a `Trial` or equivalent model exist in the database schema?
- Is there a `POST /api/v1/trials` endpoint?
- Is the capability token hashed server-side?
- Are trial resources scoped to a trial-owned organization?

**If BE work is needed first, coordinate with BE before writing FE code.**

**FE design (build after BE is confirmed):**

Trial creation:
- `POST /api/v1/trials` → returns `{ trialId, capabilityToken }`
- Store `capabilityToken` in `sessionStorage` (tab-scoped; not in URL,
  not in analytics, not in logs)
- Inject token as `X-Trial-Token` header via a separate Axios instance
  (`src/services/api/trialClient.ts`), distinct from the authenticated
  `apiClient`

Trial workspace:
- New route `/trial` — shows a reduced workspace using trial-scoped API
- Banner: "Trial session · expires in Xh · Create a free account to keep
  your devices"
- Anonymous users can create sensors and devices (up to trial limits)
- No physical actuator access (device commands disabled)

Trial expiry UI:
- Poll `GET /api/v1/trials/:trialId/summary` every 5 minutes for remaining
  time and quota usage
- Show progress bar for device/sensor quotas

**Acceptance:**
- Visitor can start a trial from the landing page without login
- Trial data is isolated: changing the trial ID in a request returns 403
- Expired trial shows a clear "Your trial has expired" screen with a
  signup prompt
- Real device command buttons are hidden or disabled for trial users

---

### Phase 4 — Trial-to-Account Conversion

**Critical invariant:** The user must never lose work when registering.

**Before building FE, verify in BE:**
- Does the claim endpoint use a DB transaction?
- Are device/sensor IDs preserved after transfer?
- Is concurrent claim handled (second claim of same trial → error)?

**FE signup flow changes:**

Detect active trial:
- On `/signup` load, check `sessionStorage` for a trial token
- If found, `GET /api/v1/trials/:trialId/summary` and display:
  "You have [N] sensors and [M] devices ready to keep"
- Include the trial token in the signup request body (`trialToken` field)
- Do NOT include it in the URL

Post-signup:
- Clear trial token from `sessionStorage` **only** after receiving a
  successful response with `claimed: true`
- On failure: keep trial session active, show a recoverable error
- On success: dispatch `login.fulfilled` with the new auth credentials,
  redirect to `/dashboard`

**Error cases to handle in UI:**
- Email already exists → show "Sign in and claim your trial" link
- Trial expired → show "Your trial expired; you can still create a free account"
- Trial already claimed → show generic "Account created" flow

**Acceptance (mirrors original brief — these are unchanged because they are correct):**
1. Happy path preserves sensors, devices, telemetry
2. Trial becomes claimed exactly once
3. Invalid/expired token → no account, nothing transferred
4. Failed transaction → user can retry without duplicate records
5. Concurrent claims → only one succeeds
6. Existing email → sign-in-then-claim flow
7. Network timeout retry → idempotent
8. Different user cannot claim another's trial
9. Frontend clears trial token only after server confirmation

---

### Phase 5 — Authenticated Workspace Improvements

**Context:** Much of Phase 4 (in the original plan) already exists.
This phase fills the genuine gaps in the current authenticated experience.

**Gap 1: Time-series charts**
- The `TelemetryDashboard` is a live table. Add a chart panel above it.
- New component: `src/components/telemetry/TelemetryChart.tsx`
- Use a lightweight chart library (Recharts is already close to the
  existing stack; verify it is not already in `package.json` before adding)
- Support: time range selector (1h, 6h, 24h, 7d), unit display, empty state
- Historical data endpoint: confirm with BE (`GET /api/v1/telemetry/history?...`)

**Gap 2: Device online/offline status**
- The Device list does not show connectivity state prominently
- Add a `ConnectionStatus` badge: online / offline / unknown
- Derived from `lastSeen` timestamp or socket presence; confirm with BE
- Update `DeviceItem` and `DeviceDetails` components

**Gap 3: Dashboard stat cards with real data**
- `src/components/dashboard/StatCard.tsx` exists; verify it is wired to
  real counts from the API, not hardcoded
- Add loading skeletons if missing

**Gap 4: Rule engine — alert history**
- The rule engine creates chains with filter + action nodes
- Add a read-only alert history view: `src/containers/RuleEngine/AlertHistory.tsx`
- Requires a BE endpoint: confirm existence before building the FE

**Gap 5: Complete dark mode**
- Tailwind tokens are defined in `tailwind.config.js` but usage is inconsistent
- Audit all components for missing `dark:` variants
- Add a persistent ThemeToggle that saves preference to `localStorage`

**Gap 6: Walkthrough completion**
- `DashboardWalkthrough` is registered but only covers 3 steps
- Complete the step list to cover: dashboard → devices → sensors → rule engine → telemetry
- Guard walkthrough steps with `IS_DEV` off for now; enable in Phase 1 public launch

**Acceptance:**
- A new user sees device connectivity state on device list
- Telemetry dashboard shows a time-series chart for selected sensor/device
- Dashboard stat cards reflect real counts
- Dark mode toggle persists across sessions

---

### Phase 6 — Plans, Usage Metering, and Billing

**Pre-conditions before writing any billing code:**
- Owner confirms Stripe is legally/commercially available for the target markets
- BE has a `Usage` model and plan enforcement middleware
- Owner approves the plan matrix and pricing

**Plan model (proposed — owner must approve before implementing):**
- Free: 1 organization, up to 5 devices, 10 sensors, 7-day telemetry retention
- Pro: 5 organizations, 50 devices, unlimited sensors, 90-day retention,
  advanced rule chains, priority support
- Team: unlimited organizations, custom limits, multi-user roles, audit log,
  SLA

**FE billing work (after BE is confirmed):**

Usage display:
- `src/components/billing/UsageMeter.tsx` — progress bar per metered unit
- Show current / limit with a warning at 80% and block at 100% (with upgrade prompt)
- Wire to `GET /api/v1/billing/usage` endpoint

Plan selection:
- `src/containers/Billing/Plans.tsx` — plan comparison table
- Upgrade button calls `POST /api/v1/billing/checkout-session` and
  redirects to Stripe Checkout (provider-hosted, never handle card data in FE)

Webhook handling (BE only):
- `checkout.session.completed` — unlock plan entitlements
- `invoice.payment_failed` — show past-due banner
- `customer.subscription.deleted` — downgrade to free
- All webhooks validated with Stripe signature; processed idempotently

**Acceptance:**
- No card data touches the FE
- Forged webhook cannot unlock a plan
- Usage over limit blocks the relevant action server-side (not just frontend)
- Cancellation and payment failure have tested, graceful UI states

---

### Phase 7 — Observability and Operations

**Why here:** By Phase 6, real users and real money are flowing.
Observability must be in place before that.

**FE observability:**
- Error boundaries already exist (`src/components/common/ErrorBoundary.tsx`)
- Add Sentry (or equivalent) for runtime error tracking
  - Gate with `IS_PROD` and a `VITE_SENTRY_DSN` env var
  - Never log user credentials, device tokens, or telemetry payloads to Sentry
- Add Web Vitals reporting via `vite-plugin-pwa` or a lightweight library

**Funnel metrics (extend existing Mixpanel setup):**
- `landing_viewed`, `demo_started`, `trial_created`, `signup_completed`,
  `first_device_connected`, `first_telemetry_received`, `rule_created`,
  `plan_upgrade_clicked`, `plan_upgrade_completed`
- Implement via `MixpanelService.track()` at the correct call sites

**BE observability (confirm, do not assume):**
- Structured logs with request IDs
- Health check endpoint (`GET /health`)
- Database connection pool metrics
- Telemetry ingestion lag metric

**Rollback plan:**
- Every BE schema migration must have a down migration
- Feature flags in `src/config/index.ts` gate new FE features
- Document how to revert each phase in `docs/RUNBOOKS.md`

---

### Phase 8 — QA, Accessibility, and Release

**Test pyramid targets (cumulative by this phase):**

| Layer | Target | Tool |
|---|---|---|
| Unit (business logic, slices, utils) | 80% coverage | Vitest |
| Component (render, interaction) | Key user flows | React Testing Library |
| Integration (API contracts, DB transactions) | Critical paths | BE's test suite |
| E2E (landing → signup → device → rule) | Happy paths | Playwright |
| Security (tenant isolation, token brute-force) | OWASP top 10 | Manual + automated |
| Accessibility | WCAG AA | axe-core + manual |

**Release sequence:**
1. Local dev with seeded demo data
2. CI: `npm run lint && npm test && npm run build`
3. Staging deploy + smoke test
4. Staging: trial conversion E2E with rollback verification
5. Stripe sandbox E2E tests
6. Owner approval for prod schema changes and billing activation
7. Feature flag rollout (new routes behind flags initially)
8. Monitor funnel metrics + error rates
9. Increment rollout percentage

---

## 7. Prioritized Delivery Roadmap

```
P0 — Security baseline (no public URL until complete)
     ├── Remove console.logs
     ├── Implement token refresh
     ├── Gate debug routes
     └── Create .env.example

P0.5 — Test infrastructure
     ├── Vitest + RTL + MSW setup
     ├── CI pipeline (GitHub Actions)
     └── Auth slice + API client tests

P1 — Landing page + design system boundary
     ├── Landing page (/ route)
     ├── Document MUI vs. Tailwind boundary
     └── Dark mode toggle

P2 — Demo experience
     ├── /demo route (read-only sample data)
     └── DemoBanner component

P3 — Anonymous trial (BE must be ready first)
     ├── trialClient.ts (separate Axios instance)
     ├── /trial route
     └── Trial expiry UI

P4 — Trial-to-account conversion
     ├── Signup trial detection
     ├── Trial summary display
     └── Post-signup token handoff

P5 — Authenticated workspace gaps
     ├── TelemetryChart (time-series)
     ├── Device connectivity badges
     ├── Dashboard real data
     ├── Alert history view
     └── Complete dark mode audit

P6 — Billing (owner approval gate)
     ├── UsageMeter component
     ├── Plans page
     └── Stripe Checkout redirect

P7 — Observability
     ├── Sentry integration
     ├── Funnel events
     └── Runbooks

P8 — QA + release
     ├── E2E tests (Playwright)
     ├── Security audit
     └── Accessibility audit
```

---

## 8. Documentation to Maintain

As each phase is implemented, keep these documents current:

| Document | Contents |
|---|---|
| `docs/ARCHITECTURE.md` | Actual stack, file map, data flow diagrams |
| `docs/API_CONTRACTS.md` | FE↔BE endpoint shapes, typed request/response |
| `docs/SECURITY_THREATS.md` | Threat model, mitigations, known risks |
| `docs/DESIGN_SYSTEM.md` | MUI vs. Tailwind boundary; token reference |
| `docs/RUNBOOKS.md` | Deploy, rollback, incident response |
| `docs/PRODUCT_ROADMAP.md` | Phase status, decisions, blockers |
| `.env.example` | Every environment variable with placeholder values |

---

## 9. Definition of Done

AEMOS is ready for initial public launch when all of the following are true:

- [ ] Zero `console.log` calls in production code paths
- [ ] Token refresh works; users are not randomly logged out
- [ ] `/` renders a landing page; no login required to see the product
- [ ] `/demo` shows clearly labeled sample data without login
- [ ] Trial session is isolated, bounded, and server-enforced
- [ ] Signup preserves trial data atomically
- [ ] Time-series telemetry charts work for at least one sensor type
- [ ] Device connectivity state is visible in the device list
- [ ] Free-tier limits are enforced server-side
- [ ] Billing runs in Stripe sandbox with verified webhook handling
- [ ] Core flows pass CI: lint + unit tests + build
- [ ] Lighthouse accessibility ≥ 90 on landing and dashboard
- [ ] No unguarded debug routes in production
- [ ] `.env.example` is complete
- [ ] `docs/SECURITY_THREATS.md` is populated
- [ ] Staging smoke test passes before any production deploy

---

*This document was produced after inspecting the actual frontend repository.
Assumptions about the backend (models, migrations, endpoints) must be
verified by reading the backend code before any implementation that depends
on them.*
