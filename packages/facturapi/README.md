# @repo/facturapi

Thin wrapper around the [`facturapi`](https://www.npmjs.com/package/facturapi) SDK for issuing CFDI invoices (Mexican tax receipts) for JSConf México ticket sales. Part of [JSConfMx/core](../../README.md).

## What is this?

- `getFacturapi()` — lazily creates and caches a `Facturapi` client from `FACTURA_API_KEY`, pinned to `apiVersion: "v2"`; throws if the key is missing
- `facturapi` — a `Proxy` over `getFacturapi()` kept for call sites that access `facturapi.*` directly instead of calling `getFacturapi()` first

```ts
import { facturapi } from "@repo/facturapi";

const invoice = await facturapi.invoices.create({
  customer: customerId,
  items: [{ quantity: 1, product: { description: "JSConf MX ticket", price: 1500 } }],
  payment_form: "03",
});
```

## Environment Variables

| Variable | Used for |
|---|---|
| `FACTURA_API_KEY` | Authenticates the Facturapi client |

## Scripts

| Command | Description |
|---|---|
| `pnpm dev` | Watch mode (`tsc --watch`) |
| `pnpm build` | Compile `src` to `dist` (package `exports` serves types from `src`, runtime from `dist`) |
| `pnpm check-types` | Type-check with `tsc --noEmit` |
