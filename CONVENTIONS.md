# Project Conventions for Aider & AI Coding Assistants

## Technology Stack
- Next.js 16.4.5 (App Router), React 19.3.1, TypeScript 5, Tailwind CSS 4, shadcn/ui, `react-hook-form`.
- Backend Client: `halfred` (HAL+JSON hypermedia client via `src/api/halClient.ts`), `cookies-next` (`MYAPP_AUTH` Basic Auth cookie).
- Testing: Cucumber.js (`@cucumber/cucumber`) + Playwright (`@playwright/test`).

## Architectural Guidelines
1. **HAL Client First**: Do NOT call `fetch` directly in pages or services. Use `getHal`, `postHal`, `mergeHal`, and `mergeHalArray` from `src/api/halClient.ts`.
2. **Entity & Service Pattern**: Define `<Entity> = <Entity>Entity & Resource` in `src/types/<entity>.ts` and `<Entity>Service(authProvider: AuthProvider)` in `src/api/<entity>Api.ts`.
3. **Auth Provider Pattern**: Pass `serverAuthProvider` in Server Components and `clientAuthProvider()` in `"use client"` components (`src/lib/authProvider.ts`). Use `useAuth()` (`src/app/components/authentication.tsx`) for client session state.
4. **App Router & Forms**: Use Server Components for read-only views (awaiting `props.params` in dynamic routes) and `"use client"` components with `useForm` (`react-hook-form`) and `@/components/ui/*` for forms. Always set `<Input id="...">` matching `<Label htmlFor="...">`.
5. **BDD Step Definitions**: Do NOT re-declare Playwright `Before`/`After` browser hooks in step files. Reuse `this.page` from `tests/e2e/support/playwright_world.ts` and existing steps in `tests/e2e/steps/login.steps.ts`.
6. **Directory Structure**: Use `src/types/` for HAL entity types, `src/api/` for HAL services, `src/app/` for App Router pages/components, and `tests/e2e/` for features and step definitions.

## Stage Playbooks (`skills/`)
- `skills/sdd-feature-designer/SKILL.md`
- `skills/sdd-cucumber-steps/SKILL.md`
- `skills/nextjs-hal-api/SKILL.md`
- `skills/nextjs-ui-pages/SKILL.md`
- `skills/sdd-bdd-verifier/SKILL.md`

## HAL Client (`src/api/halClient.ts`)
- The **only** file that calls `fetch` against the backend. Services in `src/api/*Api.ts` use it; pages and components never call `fetch`.
- Verbs: `getHal`, `postHal`, `putHal`, `patchHal`, `deleteHal`. Associations: `putUriList` / `patchUriList` (`Content-Type: text/uri-list`, e.g. `PUT /users/{id}/interests`).
- Pagination: `getPage<T>(path, rel, auth, { page, size, sort })` returns `HalPage<T>` (`items`, `page`, `links`); move with `getNextPage` / `getPrevPage` (HAL `next`/`prev` links, never build `?page=` by hand). `withQuery` builds query strings and skips empty values.
- Relations: `followLink<T>(resource, rel, auth)` (URI templates like `{?projection}` are stripped). `getEmbedded<T>(resource, rel)` reads `_embedded`.
- Errors: every non-2xx throws `HalError` (`src/lib/errors.ts`) with `status`, `message` (backend `message`/`errors`) and `fieldErrors`. Show `getErrorMessage(error)` to users and map `error.fieldMessage("email")` onto form fields.
- Entity types may include the audit fields `created?` / `modified?` (`Audited` in `src/types/hal.ts`, RNF-5).

## UI Building Blocks
- Design source: `docs/design/`. Live component catalogue: `/design` (`src/app/design/page.tsx`). Tokens live in `src/app/globals.css`; use token classes (`bg-primary`, `text-ink-soft`, `bg-success-soft`), never raw hex values.
- `src/components/ui/*` (shadcn/ui): `button` (default · outline · ghost · destructive · link; sizes `sm` 36px, `default` 40px, `lg` 48px), `badge` (adds `success` · `warning` · `danger` · `muted` · `accent` for statuses), `input`, `label`, `textarea`, `select`, `checkbox`, `switch`, `form`, `calendar`, `popover`, `dialog`, `sheet`, `dropdown-menu`, `tabs`, `table`, `pagination`, `alert`, `skeleton`, `separator`, `sonner` (toasts via `toast()` from `sonner`; `<Toaster />` is already in the layout).
- `src/components/common/*`: every page renders inside `PageContainer` (`width="narrow" | "default" | "wide"`) and starts with `PageHeader`. Every data section has loading (`LoadingState`, `CardGridSkeleton`), error (`ErrorState`) and empty (`EmptyState`) states. Destructive actions go through `ConfirmDialog`. Avatars use `UserAvatar`.
- `src/components/meetups/MeetupCard.tsx` is the one card for meetup lists; `MeetupStatusBadge` maps `OPEN`/`FULL`/`CANCELLED`/`FINISHED` to label and colour.
- UI copy is Spanish and uses "tú".

## Session & Guards
- `useAuth()` exposes `user`, `loading`, `refresh()` and `logout()`. Wait for `loading === false` before deciding anything about the session.
- Client pages: wrap protected content in `<RequireAuth>` (optionally `roles={["ROLE_ADMIN"]}`); it redirects to `/login?next=<route>`.
- Server Components: `await requireUser("/route", roles?)` from `src/lib/session.ts`; it redirects to login or `/acceso-denegado`.
- Navigation links and their roles live in `NAV_LINKS` (`src/lib/navigation.ts`). `safeNextPath` validates `?next=` so login never redirects off-site.
