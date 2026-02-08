# CLAUDE.md - AI Assistant Guide for Open Crumb Web

This document provides comprehensive guidance for AI assistants working on the Open Crumb Web codebase.

## Project Overview

Open Crumb Web is a Next.js application providing tools for small-scale bakers, currently featuring batch calculators based on baker's percentage mathematics. The project is in early development with a focus on authentication, user management, and bread dough calculation tools.

**Target Users**: Small-scale bakers who need accurate batch calculations and recipe management
**Current Stage**: Early development - foundational features implemented
**Tech Philosophy**: Server-first, type-safe, accessible, and well-tested

## Quick Reference

### Common Commands
```bash
npm run dev          # Start development server (localhost:3000)
npm run build        # Production build (runs prisma generate first)
npm run lint         # Run ESLint
npm run test         # Run Jest tests
npm run format       # Format code with Prettier
npx prisma studio    # Open Prisma Studio (database GUI)
npx prisma migrate dev  # Create and apply migrations
```

### Key Directories
- `src/app/` - Next.js App Router pages and layouts
- `src/ui/` - All React components (design system + features)
- `src/lib/` - Business logic, utilities, and core functions
- `prisma/` - Database schema and migrations

### Path Aliases
- `@/*` resolves to `src/*` (e.g., `@/lib/auth`, `@/ui/design/button`)
- `@ui/*` resolves to `src/ui/design/*` (Shadcn components)
- `@components/*` resolves to `src/ui/*` (all components)

## Technology Stack

### Core Framework
- **Next.js 16.1.6** - App Router with Server Components and Server Actions
- **React 19.2.4** - Latest React with Server Component support
- **TypeScript 5.9.3** - Strict mode enabled

### Styling & UI
- **Tailwind CSS 4.1.18** - Utility-first CSS with custom theme
- **Shadcn/UI** - Component system built on Radix UI primitives
- **Radix UI** - Accessible component primitives (dropdown, select, navigation, etc.)
- **CVA** (class-variance-authority) - Component variant styling
- **Lucide React** - Icon library

### Database & Backend
- **PostgreSQL** - Primary database
- **Prisma 7.3.0** - ORM with typed queries
- **Better Auth 1.4.18** - Authentication library with session management
- **Zod 4.3.6** - Runtime validation and type inference

### State & Data
- **Zustand 5.0.11** - Lightweight state management (used minimally)
- **neverthrow 8.2.0** - Functional error handling with Result types

### Testing & Quality
- **Jest 30.2.0** - Test runner with jsdom environment
- **Testing Library** - React component testing utilities
- **ESLint 9.39.2** - Linting with Next.js + Prettier configs
- **Prettier 3.8.1** - Code formatting (tabs, trailing commas)

## Architecture Patterns

### Server/Client Component Strategy

**Server Components (Default)**
- Pages (`app/**/page.tsx`)
- Layouts (`app/**/layout.tsx`)
- Any component that doesn't need interactivity
- Data fetching should happen in server components

**Client Components (`"use client"`)**
- Forms with state or event handlers
- Components using React hooks (useState, useEffect, etc.)
- Interactive UI elements (dropdowns, modals, editors)
- Zustand store consumers

**Key Rule**: Start with Server Components, add `"use client"` only when necessary.

### Server Actions Pattern

Server actions are the primary way to handle form submissions and mutations:

```typescript
// In src/ui/[feature]/actions.ts
export async function myAction(
  state: MyState,
  formData: FormData
): Promise<MyState> {
  // 1. Validate with Zod
  const result = schema.safeParse({
    field: formData.get("field"),
  });

  if (!result.success) {
    return { errors: result.error.flatten().fieldErrors };
  }

  // 2. Perform business logic
  await performAction(result.data);

  // 3. Redirect or return success
  redirect("/success-page");
}
```

**Usage in Components**:
```typescript
"use client";
import { useActionState } from "react";

const [state, action] = useActionState(myAction, { errors: {} });
```

### Authentication Flow

**Server-Side Session Checking**:
```typescript
import { getSession } from "@/lib/auth";

export default async function ProtectedPage() {
  const session = await getSession();
  if (!session) redirect("/sign-in");

  return <Dashboard user={session.user} />;
}
```

**Key Points**:
- `getSession()` is cached per request (uses React's `cache()`)
- Sessions are cookie-based (httpOnly, secure in production)
- Sign-up is currently disabled (`SIGN_UP_ENABLED = false`)
- Better Auth handles all auth routes at `/api/auth/*`

### Database Patterns

**Prisma Client Usage**:
```typescript
import { prisma } from "@/lib/prisma";

// Always use the singleton instance
const users = await prisma.user.findMany();
```

**Migration Workflow**:
1. Edit `prisma/schema.prisma`
2. Run `npx prisma migrate dev --name description`
3. Prisma Client regenerates automatically
4. Commit both schema and migration files

**Current Schema** (Better Auth tables only):
- `User` - User accounts (id, email, name, image)
- `Session` - Active sessions with tokens
- `Account` - OAuth providers + password storage
- `Verification` - Email verification tokens

### State Management with Zustand

Zustand is used sparingly for complex UI state. Example from batch calculator:

```typescript
// src/ui/calculators/batch/ui-state.ts
interface UIState {
  mode: "EDIT" | "RESULT";
  name: string;
  ingredients: IngredientUIInput[];
  // ... other fields
}

export const useUIStore = create<UIState>((set) => ({
  mode: "EDIT",
  name: "",
  setMode: (mode) => set({ mode }),
  // ... other setters
}));

// Selectors for computed state
export const selectCanProceed = (state: UIState): boolean => {
  return state.ingredients.some(i => i.type === "flour" && i.percentage > 0);
};
```

**Usage**:
```typescript
const mode = useUIStore((state) => state.mode);
const canProceed = useUIStore(selectCanProceed);
```

**When to Use Zustand**:
- Complex form state with multiple interdependent fields
- State shared across many components (but not global)
- Computed state that needs memoization

**When NOT to Use Zustand**:
- Simple local component state (use `useState`)
- Server state (use Server Components or Server Actions)
- Global user state (use Better Auth session)

## Code Conventions

### TypeScript

**Strict Mode**: All strict TypeScript checks are enabled.

**Type Exports**:
```typescript
// Always export types explicitly
export type IngredientUIInput =
  | SourdoughStarterInput
  | PoolishInput
  | BigaInput
  | ScaldInput
  | RawIngredientInput;
```

**Discriminated Unions**:
```typescript
// Use discriminated unions with 'type' field
type Ingredient =
  | { type: "flour"; name: string; percentage: number }
  | { type: "water"; percentage: number };

// Exhaustive checking with assertUnreachable
function processIngredient(ingredient: Ingredient) {
  switch (ingredient.type) {
    case "flour": return handleFlour(ingredient);
    case "water": return handleWater(ingredient);
    default: return assertUnreachable(ingredient); // Compile error if case missed
  }
}
```

**Validation with Zod**:
```typescript
const signInSchema = z.object({
  email: z.string().email(),
  password: z.string().min(MIN_PASSWORD_LENGTH),
});

type SignInInput = z.infer<typeof signInSchema>;
```

### Component Conventions

**Naming**:
- Components: `PascalCase` (e.g., `BatchCalculator.tsx`)
- Utilities: `camelCase` (e.g., `calculateDoughBatch()`)
- Constants: `SCREAMING_SNAKE_CASE` (e.g., `MIN_PASSWORD_LENGTH`)
- Types/Interfaces: `PascalCase` (e.g., `IngredientUIInput`)

**File Organization**:
```
feature/
├── FeatureComponent.tsx        # Main component
├── FeatureEditor.tsx           # Sub-component
├── actions.ts                  # Server actions
├── ui-state.ts                 # Zustand store (if needed)
└── __tests__/
    └── FeatureComponent.test.tsx
```

**Component Structure**:
```typescript
"use client"; // Only if needed

import { /* ... */ } from "@/lib/...";
import { Button } from "@ui/button";

interface MyComponentProps {
  title: string;
  onSubmit?: () => void;
}

export function MyComponent({ title, onSubmit }: MyComponentProps) {
  // Hooks first
  const [state, setState] = useState(false);

  // Event handlers
  const handleClick = () => {
    setState(true);
    onSubmit?.();
  };

  // Render
  return (
    <div className="flex flex-col gap-md">
      <h1>{title}</h1>
      <Button onClick={handleClick}>Submit</Button>
    </div>
  );
}
```

### Styling with Tailwind

**Custom Spacing** (defined in `globals.css`):
- `gap-sm`, `mt-sm`, etc. → 0.5rem
- `gap-md`, `mt-md`, etc. → 1rem
- `gap-lg`, `mt-lg`, etc. → 2rem

**Example**:
```tsx
<div className="flex flex-col gap-md mb-lg">
  <Input className="w-full" />
</div>
```

**Conditional Classes**:
```typescript
import { cn } from "@/lib/utils";

className={cn(
  "base-class",
  isActive && "active-class",
  variant === "primary" && "primary-class"
)}
```

**Component Variants with CVA**:
```typescript
import { cva, type VariantProps } from "class-variance-authority";

const buttonVariants = cva("base-button-classes", {
  variants: {
    variant: {
      default: "bg-primary text-white",
      destructive: "bg-destructive text-white",
    },
    size: {
      sm: "h-8 px-3",
      md: "h-10 px-4",
    },
  },
  defaultVariants: {
    variant: "default",
    size: "md",
  },
});

type ButtonProps = VariantProps<typeof buttonVariants>;
```

### Testing Patterns

**Test File Location**: Co-locate tests in `__tests__/` directory next to source

**Test Structure**:
```typescript
import { calculateDoughBatch } from "../dough";

describe("calculateDoughBatch", () => {
  describe("simple dough calculations", () => {
    test("calculates flour weight correctly", () => {
      const result = calculateDoughBatch({
        targetHydrationPercent: 70,
        totalDoughWeight: 1000,
        inclusions: [],
      });

      expect(result.flourWeight).toBe(588);
    });
  });

  describe("edge cases", () => {
    test("handles zero flour percentage", () => {
      // ...
    });
  });
});
```

**What to Test**:
- ✅ Business logic (calculators, utilities)
- ✅ Complex algorithms (baker's percentage math)
- ✅ Edge cases and error conditions
- ✅ Validation logic
- ❌ Trivial getters/setters
- ❌ Third-party library behavior
- ❌ Presentational components (unless complex logic)

**Test Commands**:
```bash
npm test                    # Run all tests
npm test -- --watch         # Watch mode
npm test -- path/to/test    # Run specific test
```

## Component Library (Shadcn/UI)

### Available Design Components

All design system components are in `src/ui/design/`:

| Component | Import | Purpose |
|-----------|--------|---------|
| Button | `@ui/button` | Primary actions, links, variants |
| Input | `@ui/input` | Text inputs with after slot |
| Label | `@ui/label` | Accessible form labels |
| Field | `@ui/field` | Form field wrapper with errors |
| Link | `@ui/link` | Next.js Link with styling |
| DropdownMenu | `@ui/dropdown-menu` | Context menus |
| Select | `@ui/select` | Accessible dropdowns |
| NavigationMenu | `@ui/navigation-menu` | Header navigation |
| Separator | `@ui/separator` | Visual dividers |
| Badge | `@ui/badge` | Small status indicators |

### Adding New Shadcn Components

```bash
# Using the Shadcn CLI
npx shadcn@latest add [component-name]

# Example
npx shadcn@latest add dialog
```

This will:
1. Add the component to `src/ui/design/`
2. Install required dependencies
3. Update `components.json` if needed

### Custom Form Components (Field)

The `Field` component provides a consistent form field layout:

```tsx
import { Field, FieldLabel, FieldError } from "@ui/field";
import { Input } from "@ui/input";

<Field variant="vertical">
  <FieldLabel>Email</FieldLabel>
  <Input name="email" type="email" />
  <FieldError>{state.errors?.email}</FieldError>
</Field>
```

**Variants**:
- `vertical` (default) - Label above input
- `horizontal` - Label beside input
- `responsive` - Vertical on mobile, horizontal on desktop

## Business Logic: Calculators

### Baker's Percentage Mathematics

The core domain logic for bread calculations is in `src/lib/calculators/dough.ts`.

**Key Concepts**:
- Baker's percentage: Ingredient weights as percentages of flour weight
- Hydration: Water percentage (e.g., 70% hydration = 70g water per 100g flour)
- Inclusions: Pre-ferments (sourdough starter, poolish, biga) and other additions

**Main Function**:
```typescript
calculateDoughBatch(input: CalculateDoughBatchInput): CalculateDoughBatchResult
```

**Input Types**:
```typescript
type CalculateDoughBatchInput = {
  name?: string;

  // One of these scaling modes
  mode: "by-dough-weight" | "by-flour-weight";
  totalDoughWeight?: number;  // Required if mode === "by-dough-weight"
  totalFlourWeight?: number;  // Required if mode === "by-flour-weight"

  // Percentages
  targetHydrationPercent: number;
  saltPercent: number;

  // Pre-ferments and inclusions
  sourdoughStarter?: SourdoughStarter;
  poolish?: Poolish;
  biga?: Biga;
  scald?: Scald;
  rawIngredients: RawIngredient[];
};
```

**Result**:
```typescript
type CalculateDoughBatchResult = {
  flourWeight: number;
  waterWeight: number;
  saltWeight: number;
  totalDoughWeight: number;
  // ... breakdown of inclusions
};
```

**Important**:
- All percentages are stored as whole numbers (70 = 70%, not 0.7)
- Math utilities handle rounding to 2 decimal places
- Extensive test coverage ensures accuracy

**Mathematical Derivations**: See `src/lib/calculators/README.md` for full equations.

## Database Schema & Migrations

### Current Schema (Better Auth)

```prisma
model User {
  id            String    @id
  name          String
  email         String    @unique
  emailVerified Boolean   @default(false)
  image         String?
  createdAt     DateTime  @default(now())
  updatedAt     DateTime  @updatedAt
  sessions      Session[]
  accounts      Account[]
}

model Session {
  id        String   @id
  expiresAt DateTime
  token     String   @unique
  ipAddress String?
  userAgent String?
  userId    String
  user      User     @relation(...)
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
}

// Account and Verification models also exist
```

### Adding New Models

When adding new database tables:

1. **Edit Schema**:
```prisma
// prisma/schema.prisma
model Recipe {
  id        String   @id @default(nanoid())
  name      String
  userId    String
  user      User     @relation(fields: [userId], references: [id], onDelete: Cascade)
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt

  @@index([userId])
}
```

2. **Add Relation to User**:
```prisma
model User {
  // ... existing fields
  recipes Recipe[]
}
```

3. **Create Migration**:
```bash
npx prisma migrate dev --name add_recipe_model
```

4. **Use in Code**:
```typescript
import { prisma } from "@/lib/prisma";

const recipes = await prisma.recipe.findMany({
  where: { userId: user.id },
  include: { user: true },
});
```

### Important Constraints

- Always use `@id` with `@default(nanoid())` for primary keys
- Add `onDelete: Cascade` for user-owned resources
- Index foreign keys for query performance: `@@index([userId])`
- Include `createdAt` and `updatedAt` for audit trails

## Common Development Tasks

### Adding a New Page

1. **Create Route File**:
```typescript
// src/app/my-page/page.tsx
import { getSession } from "@/lib/auth";
import { redirect } from "next/navigation";

export default async function MyPage() {
  const session = await getSession();
  if (!session) redirect("/sign-in");

  return <div>My Page Content</div>;
}
```

2. **Add to Navigation** (if public):
```tsx
// src/ui/header/Header.tsx
<NavigationMenuItem>
  <NavigationMenuLink asChild>
    <Link href="/my-page">My Page</Link>
  </NavigationMenuLink>
</NavigationMenuItem>
```

### Adding a New Form with Server Action

1. **Create Server Action**:
```typescript
// src/ui/my-feature/actions.ts
"use server";

import { z } from "zod";
import { redirect } from "next/navigation";

const schema = z.object({
  name: z.string().min(1),
});

export type MyActionState = {
  errors?: z.inferFlattenedErrors<typeof schema>["fieldErrors"];
};

export async function myAction(
  state: MyActionState,
  formData: FormData
): Promise<MyActionState> {
  const result = schema.safeParse({
    name: formData.get("name"),
  });

  if (!result.success) {
    return { errors: result.error.flatten().fieldErrors };
  }

  // Perform action
  await performBusinessLogic(result.data);

  redirect("/success");
}
```

2. **Create Form Component**:
```tsx
// src/ui/my-feature/MyForm.tsx
"use client";

import { useActionState } from "react";
import { myAction } from "./actions";
import { Field, FieldLabel, FieldError } from "@ui/field";
import { Input } from "@ui/input";
import { Button } from "@ui/button";

export function MyForm() {
  const [state, action] = useActionState(myAction, { errors: {} });

  return (
    <form action={action} className="flex flex-col gap-md">
      <Field>
        <FieldLabel>Name</FieldLabel>
        <Input name="name" required />
        <FieldError>{state.errors?.name}</FieldError>
      </Field>

      <Button type="submit">Submit</Button>
    </form>
  );
}
```

### Adding Business Logic with Tests

1. **Create Function**:
```typescript
// src/lib/my-feature.ts
export type MyInput = {
  value: number;
};

export type MyResult = {
  doubled: number;
};

export function myFunction(input: MyInput): MyResult {
  return { doubled: input.value * 2 };
}
```

2. **Create Tests**:
```typescript
// src/lib/__tests__/my-feature.test.ts
import { myFunction } from "../my-feature";

describe("myFunction", () => {
  test("doubles the input value", () => {
    const result = myFunction({ value: 5 });
    expect(result.doubled).toBe(10);
  });

  test("handles zero", () => {
    const result = myFunction({ value: 0 });
    expect(result.doubled).toBe(0);
  });
});
```

3. **Run Tests**:
```bash
npm test
```

## Things to Watch Out For

### Authentication Gotchas

1. **Sign-up is Currently Disabled**: `SIGN_UP_ENABLED = false` in `auth.ts`. To enable, set to `true`.

2. **Password Requirements**: Minimum 12 characters (defined in `MIN_PASSWORD_LENGTH`)

3. **Session Checking**: Always use `getSession()` from `@/lib/auth`, not direct Better Auth calls:
```typescript
// ✅ Correct
import { getSession } from "@/lib/auth";
const session = await getSession();

// ❌ Wrong
import { auth } from "@/lib/auth";
const session = await auth.api.getSession(); // No React cache
```

### Prisma Gotchas

1. **Client Generation**: Run `npx prisma generate` after schema changes or the client will be out of sync

2. **Singleton Import**: Always import from `@/lib/prisma`, never create a new client:
```typescript
// ✅ Correct
import { prisma } from "@/lib/prisma";

// ❌ Wrong
import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient(); // Creates connection pool issues
```

3. **Migration Files**: Always commit migration files to Git

### TypeScript Gotchas

1. **Zod Type Inference**: Use `z.infer<typeof schema>` to derive types from Zod schemas:
```typescript
const schema = z.object({ name: z.string() });
type MyType = z.infer<typeof schema>; // { name: string }
```

2. **Exhaustive Checking**: Use `assertUnreachable()` in switch statements to catch missing cases:
```typescript
switch (type) {
  case "A": return handleA();
  case "B": return handleB();
  default: return assertUnreachable(type); // Type error if case C added
}
```

3. **FormData Types**: FormData values are always `string | File | null`:
```typescript
const name = formData.get("name"); // string | File | null
const nameStr = formData.get("name") as string; // Type assertion
```

### Styling Gotchas

1. **Tailwind v4 Syntax**: This project uses Tailwind v4, which has different config syntax (CSS-based)

2. **Custom Spacing**: Use `gap-md`, `mt-lg`, etc. instead of arbitrary values for consistency

3. **Dark Mode**: Uses `prefers-color-scheme` (no manual toggle yet)

### Performance Considerations

1. **Server Component Default**: Don't add `"use client"` unless necessary. Server components are faster.

2. **Zustand Array Comparisons**: Use `useShallow` when selecting arrays to avoid re-renders:
```typescript
import { useShallow } from "zustand/react/shallow";

const items = useUIStore(useShallow((state) => state.items));
```

3. **React Cache**: `getSession()` uses React's `cache()` to dedupe requests within a single render

## Environment Setup

### Required Environment Variables

Create `.env.local` with:

```bash
# Database
DATABASE_URL="postgresql://user:password@localhost:5432/opencrumb"

# Better Auth
BETTER_AUTH_URL="http://localhost:3000/api/auth"
BETTER_AUTH_SECRET="your-secret-key-here" # Generate with: openssl rand -base64 32

# Node environment
NODE_ENV="development"
```

### Local Development Setup

1. **Clone and Install**:
```bash
git clone [repo-url]
cd open-crumb-web
npm install
```

2. **Setup Database**:
```bash
# Create PostgreSQL database
createdb opencrumb

# Run migrations
npx prisma migrate dev
```

3. **Start Development Server**:
```bash
npm run dev
```

4. **Open Browser**: Navigate to `http://localhost:3000`

### Enabling Sign-up for Testing

To test sign-up flow during development:

```typescript
// src/lib/auth.ts
const SIGN_UP_ENABLED = true; // Change to true
```

## Code Quality Checklist

Before submitting changes, ensure:

- [ ] **TypeScript**: No type errors (`npm run build` compiles cleanly)
- [ ] **Linting**: No ESLint errors (`npm run lint` passes)
- [ ] **Formatting**: Code is formatted (`npm run format`)
- [ ] **Tests**: All tests pass (`npm test`)
- [ ] **New Logic**: Complex logic has unit tests
- [ ] **Server/Client**: `"use client"` only where necessary
- [ ] **Imports**: Use path aliases (`@/lib/...` not `../../../lib/...`)
- [ ] **Types**: All functions have typed parameters and return types
- [ ] **Validation**: User inputs validated with Zod schemas
- [ ] **Security**: No SQL injection, XSS, or credential exposure risks

## Project Roadmap & Future Considerations

Based on the current codebase, these areas may be developed:

1. **User Features**:
   - Save and manage recipes
   - User profiles and preferences
   - Recipe sharing

2. **Calculator Enhancements**:
   - Additional calculator types (sourdough timelines, ingredient conversions)
   - Print/export functionality
   - Unit conversions (metric ↔ imperial)

3. **Infrastructure**:
   - Database backup strategy
   - Production monitoring
   - Error tracking (Sentry, etc.)
   - Analytics

4. **Quality**:
   - E2E tests (Playwright, Cypress)
   - Component visual tests
   - Performance monitoring

## Getting Help

- **Next.js Docs**: https://nextjs.org/docs
- **Tailwind CSS**: https://tailwindcss.com/docs
- **Shadcn/UI**: https://ui.shadcn.com/docs
- **Prisma**: https://www.prisma.io/docs
- **Better Auth**: https://www.better-auth.com/docs
- **Zod**: https://zod.dev

## Summary for AI Assistants

When working on this codebase:

1. **Read First**: Always read existing code before suggesting changes
2. **Server-First**: Default to Server Components, use client components sparingly
3. **Type Safety**: Use TypeScript strictly, validate inputs with Zod
4. **Test Coverage**: Add tests for business logic and complex algorithms
5. **Conventions**: Follow existing patterns (file structure, naming, styling)
6. **Simple Solutions**: Avoid over-engineering, keep changes focused
7. **Security**: Validate all user inputs, use parameterized queries, avoid XSS
8. **Accessibility**: Use Radix UI primitives for accessible components
9. **Documentation**: Update this file when patterns change significantly

---

**Last Updated**: 2026-02-08
**Project Version**: 0.1.0
**Maintained By**: Open Crumb Team
