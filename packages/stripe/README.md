# @repo/stripe

Thin wrapper around the `stripe` SDK for the JSConf México ticket checkout flow. Part of [JSConfMx/core](../../README.md); consumed by `apps/web` for checkout session creation and webhook signature verification.

## What is this?

- `getStripe()` — lazily creates and caches a `Stripe` client from `STRIPE_SECRET_KEY`, pinned to API version `2026-06-24.dahlia`; throws if the key is missing
- `stripe` — a `Proxy` over `getStripe()` kept for call sites that access `stripe.*` directly instead of calling `getStripe()` first

```ts
import { stripe } from "@repo/stripe";

const session = await stripe.checkout.sessions.create({
  mode: "payment",
  line_items: [{ price: process.env.STRIPE_PRICE_ID, quantity: 1 }],
  success_url: "https://example.com/success-stripe",
  cancel_url: "https://example.com/error-stripe",
});
```

## Environment Variables

| Variable | Used for |
|---|---|
| `STRIPE_SECRET_KEY` | Authenticates the Stripe client |
| `STRIPE_PRICE_ID` | Price used by the checkout session (read at the call site in `apps/web`, not by this package) |

## Scripts

| Command | Description |
|---|---|
| `pnpm dev` | Watch mode (`tsc --watch`) |
| `pnpm build` | Compile `src` to `dist` (package `exports` serves types from `src`, runtime from `dist`) |
| `pnpm check-types` | Type-check with `tsc --noEmit` |
