# @repo/database

Prisma data layer for the JSConf México monorepo — a Postgres (Neon) connection via `@prisma/adapter-pg`, wrapped in a cached client singleton. Part of [JSConfMx/core](../../README.md); consumed by `apps/web`.

## What is this?

- `src/index.ts` exports a `prisma` singleton (`PrismaClient` + `PrismaPg` driver adapter), cached on `globalThis` outside production so hot-reload doesn't open a new connection per edit
- Query logging is `["query", "error", "warn"]` in development, `["error"]` otherwise
- All generated Prisma types/enums/models are re-exported from `./generated/prisma/client`
- Schema lives in `prisma/schema.prisma`; one model today:

```prisma
model User {
  id        String   @id @default(cuid())
  email     String
  fullname  String
  country   String
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
}
```

## Usage

```ts
import { prisma } from "@repo/database";

const users = await prisma.user.findMany();
```

## Environment Variables

| Variable | Used for |
|---|---|
| `DATABASE_URL` | Postgres (Neon) connection string, read by both the adapter at runtime and the Prisma CLI (`prisma.config.ts`) |

## Scripts

| Command | Description |
|---|---|
| `pnpm generate` | Regenerate the Prisma client into `src/generated/prisma` |
| `pnpm migrate:dev` | Create/apply a dev migration (`prisma migrate dev`) |

Run these from `packages/database` with a local `.env` containing `DATABASE_URL`, or via the root scripts `pnpm db:generate` / `pnpm db:migrate:dev`.
