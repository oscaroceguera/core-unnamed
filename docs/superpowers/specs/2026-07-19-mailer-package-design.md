# Mailer Package Design

**Date:** 2026-07-19
**Status:** Approved

## Goal

Provide a shared `@repo/mailer` package for sending email via AWS SES, consumed by `apps/web` through a Next.js Server Action.

## Current State

- `packages/mailer/index.ts` exists and exports a raw nodemailer transporter backed by `@aws-sdk/client-sesv2`. The SES client is created at module import time.
- `apps/web/app/email-sender.ts` imports the transporter and sends a hardcoded test email. It lacks a `"use server"` directive.
- `apps/web/app/BtnSendEmail.tsx` is a `"use client"` component that imports and calls `emailSender()` directly, which pulls server-only code (AWS SDK + credentials) into the client bundle. This is the core defect.
- Credentials live in both `apps/web/.env` (loaded by Next.js) and `packages/mailer/.env` (never loaded). Both are gitignored.

## Design

### packages/mailer

`index.ts` exports:

- `sendEmail(input: SendEmailInput): Promise<void>`
  - `SendEmailInput`: `{ to: string | string[]; subject: string; html?: string; text?: string; from?: string }`
  - `from` defaults to `"JSConf MX" <no-reply@jsconf.mx>`.
  - Throws on failure; no internal try/catch swallowing. Callers decide error handling.
- `SendEmailInput` type.
- The raw transporter is no longer exported.

Implementation details:

- SESv2 client and transporter are lazily initialized on first `sendEmail` call (module-level singleton), so importing the package never reads env vars at build time.
- Env vars read: `INFRA_REGION`, `INFRA_ACCESS_KEY_ID`, `INFRA_SECRET_ACCESS_KEY`.
- `@types/nodemailer` moves from `dependencies` to `devDependencies`.
- `packages/mailer/.env` is deleted; env is provided by the consuming app (`apps/web/.env`).

### apps/web

- `app/email-sender.ts` becomes a Server Action: `"use server"` at top, calls `sendEmail(...)`, returns `{ ok: true } | { ok: false; error: string }` instead of swallowing errors.
- `app/BtnSendEmail.tsx` remains a client component; calls the action and logs the result.
- Remove direct dependencies now owned by the mailer package: `@aws-sdk/client-sesv2`, `nodemailer`, `@types/nodemailer`.

### Environment

- `apps/web/.env` holds `INFRA_REGION`, `INFRA_ACCESS_KEY_ID`, `INFRA_SECRET_ACCESS_KEY`. Confirmed gitignored (root and app-level `.gitignore`).

## Error Handling

- Package: missing env vars or SES failures surface as thrown errors with their original messages.
- Server Action: catches, logs server-side, returns `{ ok: false, error }` so the client gets a serializable result.

## Testing

Manual verification: run `pnpm dev`, click the Send Email button, confirm `{ ok: true }` result, email arrives, and no server errors. Also confirm the client bundle no longer includes AWS SDK (build succeeds without env leakage).

## Out of Scope

- Email templates, queueing/retries, multiple providers, unit tests for the SES integration.
