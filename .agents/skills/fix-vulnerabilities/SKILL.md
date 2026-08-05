---
name: fix-vulnerabilities
description: Use when someone asks to fix vulnerabilities, fix vulns, fix pnpm/npm vulnerabilities, resolve audit findings, patch CVEs, or run/act on `pnpm audit` or `npm audit` in this repo.
---

# Fix Vulnerabilities

## Overview

Patch dependency vulnerabilities in this pnpm monorepo without breaking the app. Bump only what's needed, verify with build/typecheck/lint/test after every change, and stop at the first regression instead of pushing through it.

## Facts about this repo

- Package manager: **pnpm** (`packageManager: pnpm@9.0.0` in root `package.json`, `pnpm-lock.yaml` present) — never use `npm`/`yarn` commands here.
- Node version: read `.nvmrc` (currently `v24`) — run `nvm use` (or equivalent) before installing/auditing so resolution matches CI.
- Turborepo monorepo — verification commands (`build`, `lint`, `check-types`) fan out to all workspaces via `turbo run`.

## Quick reference

| Step | Command |
|---|---|
| Match Node version | `nvm use` |
| Audit | `pnpm audit` |
| Safe fix | `pnpm audit --fix` |
| Why is this installed | `pnpm why <package>` |
| Re-lock | `pnpm install` |
| Verify | `pnpm build && pnpm check-types && pnpm lint && pnpm test` |
| Check lockfile diff | `git diff pnpm-lock.yaml` |

## Files in this skill

- `references/process.md` — full step-by-step fix workflow (audit → triage → fix → verify → report).
- `references/best-practices.md` — severity triage, one-package-at-a-time discipline, changelog checks, and guardrails against `npm`/`--force`/silent suppression.
- `evals/scenarios.md` — self-check scenarios (build breaks after a bump, user pressure to `--force`, transitive-only vulns, etc.) with correct behavior vs. fail signals.

Read `references/process.md` and `references/best-practices.md` before making any changes. Check `evals/scenarios.md` any time the situation feels like it matches one of its rows.
