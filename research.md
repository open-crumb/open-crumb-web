# Bakery Organisation: Research & Implementation Plan

## Current State

The previous commit added the Better Auth `organization()` plugin and its Prisma models. The following are already in place:

- **`src/lib/auth.ts`** — `organization()` plugin registered alongside `nextCookies()`
- **`prisma/schema.prisma`** — `Organization`, `Member`, and `Invitation` models with proper indexes and cascade deletes
- **Migration applied** — `20260303123704_better_auth_org_models`

No UI or server actions exist yet for organisations.

---

## Better Auth Organisation API

All calls require `headers: await headers()` so that Better Auth can read the session cookie.

### Create organisation
```typescript
await auth.api.createOrganization({
  body: {
    name: string,   // display name
    slug: string,   // URL-safe identifier, must be unique
    logo?: string,
    metadata?: Record<string, unknown>,
  },
  headers: await headers(),
});
```
The calling user is automatically added as `owner`.

### List organisations
```typescript
const orgs = await auth.api.listOrganizations({
  headers: await headers(),
});
// Returns Organisation[] — only orgs where the user is a member
```

---

## Terminology Decision

The user-facing word is **Bakery** (not "Organisation"). The slug and any domain model names use "organization" internally to match Better Auth's API.

---

## Route Structure

```
/bakeries          – list the authenticated user's bakeries
/bakeries/new      – form to create a new bakery
```

Both routes are protected (redirect to `/sign-in` when unauthenticated), following the existing `/dashboard` pattern.

---

## Slug Generation

`createOrganization` requires a `slug`. Rather than exposing a separate slug field to the user, the slug is derived server-side from the bakery name:

- Lower-case the name
- Replace spaces and non-alphanumeric characters with `-`
- Collapse consecutive dashes, trim leading/trailing dashes

Example: `"Le Pain Quotidien"` → `"le-pain-quotidien"`

A small pure utility `src/lib/slugify.ts` will handle this. If Better Auth returns a slug-collision error (`SLUG_IS_ALREADY_TAKEN`), a short random suffix is **not** added — instead the error is surfaced to the user asking them to choose a different name (or a future iteration can append a suffix).

---

## Files to Create / Modify

### 1. `src/lib/slugify.ts` *(new)*
A single exported function:
```typescript
export function slugify(input: string): string
```
No external dependencies — pure string manipulation.

### 2. `src/ui/bakeries/actions.ts` *(new)*
Server action file (`"use server"`):

```
createBakeryAction(state, formData) → CreateBakeryState
```

Flow:
1. Validate `name` with Zod (`z.string().min(1).max(100)`)
2. Derive `slug` via `slugify(name)`
3. Call `auth.api.createOrganization({ body: { name, slug }, headers })`
4. On success: `redirect("/bakeries")`
5. On `APIError`: map known codes to user-facing messages:
   - `SLUG_IS_ALREADY_TAKEN` → "A bakery with a similar name already exists."
   - everything else → generic fallback

State shape:
```typescript
type CreateBakeryState =
  | { type: "idle" }
  | { type: "error"; nameError?: string; message?: string }
```
Both branches carry `defaultValues: { name: string }` for re-populating the form.

### 3. `src/ui/bakeries/CreateBakeryForm.tsx` *(new)*
`"use client"` form component:
- `useActionState(createBakeryAction, { type: "idle", defaultValues: { name: "" } })`
- Single `name` field ("Bakery Name") using `Field / FieldLabel / Input / FieldError`
- Submit button with `aria-disabled={isPending}`
- Top-level `FieldError` for the non-field `message` error

### 4. `src/app/bakeries/new/page.tsx` *(new)*
Server component:
- Checks session; redirects to `/sign-in` if unauthenticated
- Renders a heading ("Create a Bakery") and `<CreateBakeryForm />`

### 5. `src/app/bakeries/page.tsx` *(new)*
Server component:
- Checks session; redirects to `/sign-in` if unauthenticated
- Calls `auth.api.listOrganizations({ headers })` to fetch the user's bakeries
- If the list is empty: renders a prompt with a link to `/bakeries/new`
- If the list is non-empty: renders a simple list of bakery names (with creation date)
- Always shows a "Create a Bakery" link/button

The list is rendered inline (no separate component needed at this stage — it's not complex enough to warrant one).

### 6. `src/ui/header/Header.tsx` *(modified)*
Add a **"Bakeries"** navigation link that is shown only when `isAuthenticated`:

```tsx
{isAuthenticated && (
  <NavigationMenuItem>
    <NavigationMenuLink className={navigationMenuTriggerStyle()} asChild>
      <Link href="/bakeries">Bakeries</Link>
    </NavigationMenuLink>
  </NavigationMenuItem>
)}
```
Insert it after the existing "Dashboard" link.

---

## Data Flow Diagram

```
User fills "Bakery Name" in CreateBakeryForm
  → form submitted (POST via server action)
  → createBakeryAction validates name with Zod
  → slugify(name) produces URL-safe slug
  → auth.api.createOrganization({ name, slug }, headers)
      → Better Auth writes to `organization` + `member` tables
  → redirect to /bakeries
      → auth.api.listOrganizations(headers) fetches all user orgs
      → page renders list of bakeries
```

---

## What Is Explicitly Out of Scope (for Now)

- Viewing a single bakery's detail page
- Editing / deleting a bakery
- Inviting employees / managing members
- Slug-collision auto-suffix logic
- Logo upload
- Organisation-scoped recipes or other resources

---

## Code Quality Checklist

Before committing:
- [ ] `npm run build` — no TypeScript errors
- [ ] `npm run lint` — no ESLint errors
- [ ] `npm run format` — code is formatted
- [ ] `npm test` — existing tests still pass (no new logic requiring tests; `slugify` is simple enough to merit a test file)

A test file `src/lib/__tests__/slugify.test.ts` should cover:
- Basic space-to-dash conversion
- Case normalisation
- Special characters stripped
- Leading/trailing dash trimming
- Consecutive dash collapsing
