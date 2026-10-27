# FE-POC

Frontend for a multi-tenant document workspace. A user signs up, either creates a
tenant (workspace) or joins one through an invitation, and then works with documents
inside that tenant. What a tenant is allowed to do is capped by the plan it is on.

## Tech stack

| Concern       | Choice                              |
| ------------- | ----------------------------------- |
| Build         | Vite + React 19 + TypeScript        |
| UI            | Mantine (`@mantine/core`, `hooks`)  |
| Routing       | React Router (custom route tree)    |
| Server state  | TanStack Query                      |
| Forms         | React Hook Form + Zod               |
| HTTP          | Axios (single shared instance)      |
| Notifications | react-hot-toast                     |
| Lint          | oxlint                              |

## Getting started

```bash
pnpm install
pnpm dev        # start the dev server
pnpm build      # typecheck + production build
pnpm typecheck  # tsc --noEmit
pnpm lint       # oxlint
```

Create a `.env` with the API base URL:

```
VITE_API_BASE_URL=http://localhost:9009/
```

## Domain model

- **Tenant** — a workspace. A user belongs to exactly one tenant. If you log in without
  one, onboarding asks you to create it.
- **Plan** — every tenant has a plan (free by default) that defines three allowances:
  max users, max documents, and whether the tags feature is available. Changing plan is
  a single button click for now.
- **Document** — a title, a description, and optionally tags. Owned by the user who
  created it.
- **Invitation** — an admin invites an email; the invitee opens the invitation link and
  joins the existing tenant.

## Roles

| Role               | Scope    | Can do                                                                                                                      |
| ------------------ | -------- | --------------------------------------------------------------------------------------------------------------------------- |
| **ADMIN**          | Tenant   | Everything a member can, plus: view and edit *all* documents in the tenant, invite users, delete invitations, change a member's role, change the tenant's plan. |
| **MEMBER**         | Tenant   | Create documents, and view/edit/delete only the documents they created.                                                       |
| **Platform admin** | Platform | Lives outside any tenant. Sees cross-tenant usage and overview dashboards under `/platform-admin`.                             |

Roles live in [role.ts](src/constants/role.ts). Enforcement is spread across guards and
a few hooks:

- [AdminGuard](src/guards/AdminGuard.tsx) — renders children only for tenant admins
  (redirects, or renders nothing with `navigate={false}`).
- [PlatformAdminGuard](src/guards/PlatformAdminGuard.tsx) — gates the platform admin
  section.
- [TenantUserGuard](src/guards/TenantUserGuard.tsx) — keeps platform admins out of the
  tenant app.
- [Gateway](src/global/Gateway.tsx) — pushes a user who still needs onboarding to
  `/onboarding`.
- [LimitGuard](src/guards/LimitGuard.tsx) — swaps content for a banner once a plan
  allowance (documents or users) is exhausted.
- [HasTagsFeature](src/guards/HasTagsFeature.tsx) — hides tag UI on plans without tags.
- [useIsViewer](src/modules/documents/hooks/useIsViewer.ts) +
  [withViewerControl](src/hoc/withViewerControl.tsx) — a member viewing someone else's
  document gets read-only controls.

## Auth

Header-based. The access token is kept in local storage and attached by the request
interceptor in [axiosInstance.ts](src/api/axiosInstance.ts); a `401` clears it and
sends the user back to login. [ProfileContext](src/context/ProfileContext.tsx) holds
the `me` response (user, role, tenant, plan) and is what every guard reads.
[PrivateRoute](src/routes/guards/PrivateRoute.tsx) and
[PublicRoute](src/routes/guards/PublicRoute.tsx) gate the signed-in and signed-out
branches of the route tree.

## Modules

Each module under [src/modules/](src/modules/) is self-contained:
`pages/`, `components/`, `hooks/` (one file per query/mutation), `columns/` (table
column definitions), and `[module].dto.ts` for request/response shapes.

| Module                                            | What it covers                                                                              |
| ------------------------------------------------- | ------------------------------------------------------------------------------------------- |
| [auth](src/modules/auth/)                         | Login, signup, and the profile-context query used for auth checks.                            |
| [onboarding](src/modules/onboarding/)             | Creating a tenant, plan selection, and the upgrade page with plan usage.                      |
| [dashboard](src/modules/dashboard/)               | Landing page after sign-in.                                                                   |
| [documents](src/modules/documents/)               | Document list with search/filters/pagination, create & edit, delete, tags, user-list filter.  |
| [members](src/modules/members/)                   | Member list, invited-member list, sending invitations, changing role or status, revoking.     |
| [platformAdmin](src/modules/platformAdmin/)       | Cross-tenant usage table and overview cards.                                                  |
| [profile](src/modules/profile/)                   | Profile settings.                                                                             |
| [misc](src/modules/misc/)                         | Accept-invitation flow and the 404 page.                                                      |

## Project layout

```
src/
  api/          axios instance + query client
  components/   shared ui (DataTable, Pagination, SearchBar, StatCard, ...) and common blocks
  constants/    endpoints, routePaths, queryKey, role, pagination, dateFormats
  context/      ProfileContext
  guards/       role, tenant, and plan-limit guards
  global/       Gateway
  hoc/          withViewerControl
  hooks/        cross-module hooks (useFeature, usePlan, usePagination, useTenantUser, ...)
  layouts/      Root / Auth / App / PlatformAdmin layouts
  modules/      feature modules (see above)
  routes/       routeTree.tsx, RouteTreeRenderer, route guards
  schema/       zod schemas, one per form
  types/        shared types
  utils/        auth, pagination, plan, error, color, debounce helpers
```

## Routing

Routes are declared as a tree in [routeTree.tsx](src/routes/routeTree.tsx) and rendered
by [RouteTreeRenderer](src/routes/RouteTreeRenderer.tsx). A node can carry `private`
(wraps in `PrivateRoute` / `PublicRoute`), `guard` (an array of guard components
applied outside to inside), a layout `element`, and `children`. Navigation targets come
from [ROUTE_PATHS](src/constants/routePaths.ts) — the route tree itself uses relative
path segments.

## Conventions

See [Project.md](Project.md) for the working agreements. In short: endpoints live in
[endpoints.ts](src/constants/endpoints.ts) (strings, or functions for path params),
query keys in [queryKey.ts](src/constants/queryKey.ts), query/mutation functions stay
non-async and return the axios call, components declare a `[ComponentName]Props` type,
and readability wins over brevity.
