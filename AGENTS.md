<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.

<!-- END:nextjs-agent-rules -->

## Stack

Next.js 16.2 + React 19.2 (App Router, Turbopack, `reactCompiler: true`, `typedRoutes: true`) · Prisma 7 + libSQL/SQLite · Tailwind v4 (CSS-only, no `tailwind.config.ts`) · shadcn/ui with `base-luma` style preset + `@base-ui/react` primitives (not Radix) · `next-themes` (default `dark`, `enableSystem={false}`) · `better-auth` 1.6.20 · `@t3-oss/env-nextjs` + Zod 4.

## Commands

| Script | What it does |
|---|---|
| `bun dev` | Start dev server (Turbopack) |
| `bun lint` | ESLint with `eslint-config-next` core-web-vitals + typescript |
| `bun typecheck` | `next typegen && tsc --noEmit` — use for fast type checking |
| `bun run build` | `prisma generate && next build` |
| `bun prod` | Full: `prisma generate && eslint && next build && next start` |
| `bun migrate` | `prisma migrate dev && prisma generate` |
| `bun studio` | Headless Prisma Studio (`--browser none`); open printed URL manually |

Pre-PR verification: `bun lint` then `bun typecheck`. No test framework exists.

## Prisma (v7, custom output)

- Generator: `provider = "prisma-client"`, `output = "../generated/prisma"` — not `prisma-client-js`.
- Import client as `import { PrismaClient } from "@generated/prisma/client"`. There is no `@prisma/client` import surface.
- `schema.prisma` has **no** `datasource.url` — comes from `prisma.config.ts` via `env("DATABASE_URL")` (loaded with `dotenv/config`). Do not add it inline.
- Singleton: `src/lib/database/dbClient.ts` (HMR-safe `globalThis`, wired to `PrismaLibSql`). Import from there instead of creating new `PrismaClient`.
- Migrations via `bun migrate` (not `prisma db push`). `generated/**` is gitignored — don't hand-edit.

## Env validation (T3)

- `src/lib/env/serverEnv.ts` — `experimental__runtimeEnv: process.env` (keep `experimental__` prefix verbatim).
- `src/lib/env/clientEnv.ts` — currently empty (placeholder).
- `next.config.ts` imports both as side effects at the top for load-time validation.
- New vars: add to `serverEnv.ts` (server) or `clientEnv.ts` (must be `NEXT_PUBLIC_*`), mirror in `.env.example`.
- `DATABASE_URL` must start with `file:./` (Zod-validated). `BETTER_AUTH_SECRET` min 32 chars. `BETTER_AUTH_URL` valid URL, no trailing slash.

## Styling

- Tailwind v4 config lives entirely in `src/app/globals.css` via `@theme` and `@custom-variant`. No `tailwind.config.ts`.
- PostCSS plugin: `@tailwindcss/postcss`. Must keep `@import "shadcn/tailwind.css"` in globals.css for Base Luma tokens.
- Prettier: `singleAttributePerLine: true`, `bracketSameLine: true`, `experimentalTernaries: true`, `prettier-plugin-tailwindcss`. Output matches these.
- Gradient utility: use `bg-linear-to-b` (not `bg-gradient-to-b`).
- Centering block child in grid: `justify-self-center` on child.

## shadcn / Base UI

- `components.json` maps `ui` → `@/components/shadcnui` (not `@/components/ui`). Add with `bunx shadcn add <name>`; they land in `src/components/shadcnui/`.
- Primitives from `@base-ui/react` — do not introduce Radix or `react-aria`. Existing shipped components: `Button`, `Card`, `Dialog`, `DropdownMenu`, `Field`, `Input`, `Label`, `Separator`, `Textarea`, `Checkbox`, `Combobox`.

## Better Auth

- Server: `src/lib/auth.ts` — `prismaAdapter` (SQLite), `emailAndPassword.enabled`, `nextCookies()` plugin.
- Client: `src/lib/auth-client.ts` — `createAuthClient()` from `better-auth/react`. Exposes `.useSession()` hook and `.signOut()`.
- API route: `src/app/api/auth/[...all]/route.ts` — single `auth.handler()` export.
- Password reset: server `sendResetPassword` handler + client `requestPasswordReset({ email, redirectTo })` (not `forgotPassword`). Actual reset: `resetPassword({ newPassword, token })`.
- Sign out: `authClient.signOut()` then `router.push("/")` + `router.refresh()`.
- Session cookie: `better-auth.session_token`.

## Route protection

Two layers:
1. **Optimistic (middleware)** — `src/proxy.ts` checks `better-auth.session_token` cookie; redirects unauthenticated from `/dashboard` → `/`, authenticated from auth pages → `/dashboard`.
2. **Authoritative (layout)** — `src/app/(private)/layout.tsx` calls `auth.api.getSession({ headers: await headers() })` server-side; redirects to `/` if null.

## Zod 4 differences

- Email: `z.email("message")` — **not** `z.string().email()` (Zod 3).
- Other string formats also standalone: `z.uuid()`, `z.url()`, `z.ipv4()`, etc.
- `z.boolean().default(false)` creates input/output type mismatch with `@hookform/resolvers` — prefer `z.boolean()` with `defaultValues` in `useForm` instead.

## Form patterns

Schemas in `src/lib/zodSchema.ts` — export both schema and `type X = z.infer<typeof xSchema>`.

Components use `"use client"`, `react-hook-form` + `@hookform/resolvers/zod`, and shadcn `Field`/`FieldLabel`/`FieldError` primitives:

```typescript
const { handleSubmit, control, formState: { isSubmitting } } = useForm({
  resolver: zodResolver(mySchema),
  defaultValues: { ... },
  mode: "all",
});
```

Each field through `Controller` with `Field data-invalid`, `FieldLabel`, `aria-invalid`, and `FieldError`. Submit: `<form onSubmit={handleSubmit(handler)} noValidate>`. Button disabled while submitting with icon toggle.

## Path aliases

- `@/*` → `./src/*`
- `@generated/*` → `./generated/*` (Prisma client only)

## Conventions

- `src/server/` — server-only modules (server actions, anything importing `server-only`). Individual files, no barrel index.
- `src/hooks/` — custom React hooks.
- `typedRoutes: true` — all `<Link href>` and `router.push()` targets must exist as actual route files.
- Always use `bun` / `bunx` (not npm / npx).
- Available skills for this stack: `shadcn`, `prisma-*`, `next-*`, `better-auth-*`, `vercel-react-*`, `zod`, `react-hook-form-zod`. Load via `skill` tool before writing code.
- No CI workflows or pre-commit hooks. Only verification is `bun lint` + `bun typecheck`.
