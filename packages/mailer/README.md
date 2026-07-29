# @repo/mailer

Transactional email for the JSConf México site, sent through AWS SES via Nodemailer's SES transport. Part of [JSConfMx/core](../../README.md); consumed by `apps/web`.

## What is this?

A single function, `sendEmail`, backed by a lazily-created and cached `Transporter` (`nodemailer.createTransport({ SES: ... })` on top of `@aws-sdk/client-sesv2`):

```ts
import { sendEmail } from "@repo/mailer";

await sendEmail({
  to: "attendee@example.com",
  subject: "Your JSConf MX ticket",
  html: "<p>See you there!</p>",
});
```

`SendEmailInput`: `to` (string or string[]), `subject`, optional `html`/`text`, optional `from` (defaults to `"JSConf MX" <no-reply@jsconf.mx>`).

The transporter throws on first use if the required env vars aren't set — it isn't validated at import time.

## Environment Variables

| Variable | Used for |
|---|---|
| `INFRA_REGION` | AWS region for the SES v2 client |
| `INFRA_ACCESS_KEY_ID`, `INFRA_SECRET_ACCESS_KEY` | AWS credentials for SES |

## Scripts

| Command | Description |
|---|---|
| `pnpm dev` | Watch mode (`tsc --watch`) |
| `pnpm build` | Compile `src` to `dist` (package `exports` serves types from `src`, runtime from `dist`) |
| `pnpm check-types` | Type-check with `tsc --noEmit` |
