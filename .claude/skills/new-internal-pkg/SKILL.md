---
name: new-internal-pkg
description: Use when someone mentions "create a new internal package", "new internal pkg", or "new package" for this turborepo — scaffolds a workspace package under packages/ following the @repo/stripe and @repo/mailer conventions.
---

# New Internal Package

Scaffold a new internal workspace package under `packages/`, matching the structure of existing packages like `packages/stripe` and `packages/mailer`.

Read `references/new-internal-pkg-best-practices.md` before writing. It covers structure and order, naming conventions, package-type adaptation, dependency best practices, and common pitfalls.

## Steps

1. Ask the user for the package name (kebab-case, e.g. `analytics`, `feature-flags`) if not already given.
2. Read `assets/structure-template.md` and scaffold `packages/{{PACKAGE_NAME}}/` from it, substituting `{{PACKAGE_NAME}}` throughout (`package.json`, `tsconfig.json`, `src/index.ts`).
3. Run install (e.g. `pnpm install`) from the repo root so the workspace picks up the new package.
4. Root `turbo.json`'s `build` task already outputs `dist/**` — no per-package `turbo.json` needed unless the package requires custom task config.
5. Run `scripts/create-new-package.sh {{PACKAGE_NAME}}` to validate the scaffold (structure, package.json/tsconfig.json fields, workspace registration, and `check-types`). Fix any reported failures before declaring the package done.
