# JSConfMx Core

Monorepo for the JSConf México website and shared infrastructure — the marketing/ticketing web app plus the reusable packages (UI kit, transactional mail, payments) behind it.

See [ARCHITECTURE.md](./ARCHITECTURE.md) for the full breakdown of apps, packages, and how they relate.

## Tech Stack

- [Next.js](https://nextjs.org) 16 (App Router)
- TypeScript
- [Tailwind CSS](https://tailwindcss.com) 4
- [Stripe](https://stripe.com) for payments
- AWS SES + Nodemailer for transactional email
- [Turborepo](https://turborepo.com) (pnpm workspaces)
- Deployed on [Vercel](https://vercel.com)

## Requirements

- Node.js ≥ 20
- pnpm 9 (`packageManager` in `package.json`)

## Clone repo

```bash
npx create-turbo@latest -e https://github.com/oscaroceguera/core-unnamed
```

## Getting Started

```bash
pnpm install
pnpm dev
```

This starts `apps/web` at [http://localhost:3000](http://localhost:3000).

## Project Structure

```text
.
├── apps/
│   └── web/                  # Next.js marketing/ticketing site
└── packages/
    ├── ui/                   # Shared React component library (@repo/ui)
    ├── mailer/               # Email sending via AWS SES (@repo/mailer)
    ├── stripe/               # Stripe client wrapper (@repo/stripe)
    ├── eslint-config/        # Shared ESLint configs
    ├── prettier-config/      # Shared Prettier config
    ├── tailwindcss-config/   # Shared Tailwind config
    └── typescript-config/    # Shared tsconfig bases
```

## Scripts

Run from the repo root, powered by Turborepo:

| Command            | Description                             |
| ------------------ | --------------------------------------- |
| `pnpm dev`         | Run all apps/packages in dev mode       |
| `pnpm build`       | Build all apps/packages                 |
| `pnpm lint`        | Lint all workspaces                     |
| `pnpm check-types` | Type-check all workspaces               |
| `pnpm format`      | Format `.ts`/`.tsx`/`.md` with Prettier |

## Deployment

`apps/web` is deployed on [Vercel](https://vercel.com).
