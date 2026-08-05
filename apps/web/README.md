# web

![Next.js](https://img.shields.io/badge/Next.js-16-black?logo=next.js&logoColor=white)
![React](https://img.shields.io/badge/React-19-149ECA?logo=react&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-5.9-3178C6?logo=typescript&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-4-06B6D4?logo=tailwindcss&logoColor=white)
![Stripe](https://img.shields.io/badge/Stripe-checkout-635BFF?logo=stripe&logoColor=white)

Next.js app for the JSConf México site — homepage, Stripe ticket checkout, CFDI invoicing, a transactional email demo, and the Prisma-backed user list. Part of the [JSConfMx/core](../../README.md) monorepo; see the root README for the full package graph.

## What is this?

A Next.js 16 (App Router) app built on the monorepo's shared packages:

- `@repo/ui` — `Card` component used across the homepage
- `@repo/database` — Prisma client (`prisma.user.findMany()` on the homepage)
- `@repo/stripe` — Stripe checkout session creation and webhook handling
- `@repo/facturapi` — CFDI invoice creation and email delivery
- `@repo/mailer` — transactional email via AWS SES
- `@repo/assets` — SVG icons/illustrations/logos, imported directly on the homepage (`@repo/assets/images/...`)
- `@repo/tailwind-config` — shared Tailwind CSS 4 config, imported in `app/globals.css`

Routes:

| Route | Purpose |
|---|---|
| `app/page.tsx` | Homepage — email demo, Stripe checkout, Prisma user list, assets demo, invoicing form |
| `app/stripe/success-stripe` | Stripe checkout success redirect |
| `app/stripe/error-stripe` | Stripe checkout error redirect |
| `app/api/webhook` | Stripe webhook handler (`stripe.webhooks.constructEvent`) |
| `actions/checkoutStripe.ts` | Server action that creates the Stripe checkout session |
| `actions/invoice-action.ts` | Server action that validates the invoice form (`types/invoice-schema.ts`) and creates + emails a CFDI invoice via `@repo/facturapi` |
| `actions/email-sender.ts` | Server action that sends a test email via `@repo/mailer` |

## Quick Start

Run from the repo root (this app is part of a pnpm/Turborepo workspace):

```bash
pnpm install
pnpm dev --filter=web
```

The app comes up at [http://localhost:3000](http://localhost:3000).

## Environment Variables

Copy `.env.example` to `.env` and fill in:

| Variable | Used for |
|---|---|
| `DATABASE_URL` | Neon Postgres connection string (Prisma, `@repo/database`) |
| `STRIPE_SECRET_KEY`, `STRIPE_PRICE_ID` | Stripe checkout session creation |
| `STRIPE_WEBHOOK_SIGNING_SECRET` | Verifies Stripe webhook signatures in `app/api/webhook/route.ts` |
| `FACTURA_API_KEY` | CFDI invoicing via `@repo/facturapi` (`actions/invoice-action.ts`) |
| `INFRA_REGION`, `INFRA_ACCESS_KEY_ID`, `INFRA_SECRET_ACCESS_KEY` | AWS SES transactional email (`@repo/mailer`) |

## Scripts

| Command | Description |
|---|---|
| `pnpm dev` | Start the Next.js dev server on port 3000 |
| `pnpm build` | Production build |
| `pnpm start` | Start the production server |
| `pnpm lint` | Lint with the shared `@repo/eslint-config` |
| `pnpm check-types` | Type-check with `tsc --noEmit` |

## Project Structure

```text
.
├── actions/
│   ├── checkoutStripe.ts    # Server action: create Stripe checkout session
│   ├── email-sender.ts      # Server action: send test email
│   └── invoice-action.ts    # Server action: validate + create/email a CFDI invoice
├── app/
│   ├── api/webhook/         # Stripe webhook handler
│   ├── stripe/
│   │   ├── error-stripe/    # Checkout error page
│   │   └── success-stripe/  # Checkout success page
│   ├── globals.css          # Tailwind + @repo/tailwind-config entrypoint
│   ├── layout.tsx
│   └── page.tsx             # Homepage — renders the components below
├── components/
│   ├── AssetsAccess.tsx     # @repo/assets image demo
│   ├── BtnCheckoutStripe.tsx
│   ├── BtnSendEmail.tsx
│   ├── DatabaseCard.tsx     # Prisma user list
│   ├── Invoicing.tsx        # CFDI invoice form (useActionState + invoice-action)
│   ├── SendEmail.tsx
│   └── StripeCheckout.tsx
├── types/
│   └── invoice-schema.ts    # Zod schemas for the invoice form + action state
└── public/                  # Static assets
```

## Deployment

Deploys to [Vercel](https://vercel.com) as part of the monorepo — see the root [`vercel.json`](../../vercel.json) and root README's Deployment section.
