# New Internal Package — Best Practices

Source: [Turborepo — Creating an internal package](https://turborepo.dev/docs/crafting-your-repository/creating-an-internal-package)

## Table of Contents

- [Structure and Order](#structure-and-order)
- [Naming Conventions](#naming-conventions)
- [Adapting to Package Type](#adapting-to-package-type)
- [Dependency Best Practices](#dependency-best-practices)
- [Common Pitfalls](#common-pitfalls)

## Structure and Order

- **Single purpose per package.** One package = one concern (a UI kit, one tool's config, one domain's utilities). Don't let application packages (apps under `apps/`) hold shared code — extract it into a `packages/*` package instead and have apps depend on it. Keeps the dependency graph prunable and packages independently cacheable.
- **`exports` defines the public surface.** Use it for granular entry points, not just a single `.` export, when the package has more than one logical module — e.g. `@repo/math/add` alongside `@repo/math`. Each entry needs both `types` (source `.ts`) and `default` (compiled `.js`) so consumers get types in dev and compiled JS at runtime.
- **Keep `outDir`/`rootDir` in sync with `exports`.** The compiled path in `package.json`'s `default` field must match `tsconfig.json`'s `outDir`, or `default` resolves to nothing after `build`.
- **Root `turbo.json`'s `build` task already outputs `dist/**`** — no per-package `turbo.json` needed unless the package requires custom task config (e.g. a non-default output dir, extra env vars, or a task other than `build`/`dev`/`check-types`).

## Naming Conventions

- **Name is the import path.** `name` in `package.json` (`@repo/{{PACKAGE_NAME}}`) is exactly what consumers `import` from. Pick it deliberately — renaming later means updating every importer.
- Use kebab-case for the directory and package suffix (`feature-flags`, not `featureFlags` or `FeatureFlags`), matching `packages/stripe` and `packages/mailer`.

## Adapting to Package Type

- **Config-only packages** (e.g. `@repo/typescript-config`, `@repo/eslint-config`): no `src/index.ts` build step needed — these ship raw config files (`.json`, `.js`) directly, no `exports`/`dist` compile step required.
- **SDK-wrapping packages** (e.g. `@repo/stripe`, `@repo/mailer`): add the SDK under `dependencies`, keep `src/index.ts` as the single integration surface, wrap the SDK's client rather than re-exporting it wholesale so callers get one seam to mock in tests.
- **Shared UI packages** (e.g. `@repo/ui`): use multiple `exports` entries per component instead of a single barrel export, so consumers only bundle what they import and tree-shaking stays effective.
- **Just-in-time vs. compiled.** For apps that can consume TypeScript directly (most bundler-based Next.js/Vite setups), `types`/`default` both pointing at source works fine in dev; only bundler-less consumers strictly need the `tsc`-compiled `dist/` output. The default template ships both so it works either way.

## Dependency Best Practices

- **Workspace protocol for internal deps.** Reference other internal packages with `workspace:*` (pnpm/bun) or `*` (npm/yarn) — never a version range — so changes are picked up immediately without republishing.
- Runtime SDK dependencies go under `dependencies`, not `devDependencies` — mirror how `packages/stripe` depends on `stripe` and `packages/mailer` depends on `nodemailer` / `@aws-sdk/client-sesv2`.
- Shared tooling (`typescript`, `@repo/typescript-config`, `@types/node`) stays in `devDependencies` — it's needed to build the package, not to run it.

## Common Pitfalls

- **Forgetting `include`/`exclude` in `tsconfig.json`.** These arrays are NOT inherited from the extended base config (per TypeScript's own spec) — always declare them explicitly, even though `compilerOptions` extends cleanly.
- **Mismatched `outDir` and `exports.default`.** If they drift, `pnpm build` succeeds but consumers get a "module not found" at the `default` path.
- **Skipping `pnpm install` after scaffolding.** The workspace won't recognize the new package until the lockfile is updated.
- **Adding a version range for internal deps** (e.g. `"@repo/ui": "^1.0.0"`) instead of `workspace:*` — breaks the whole point of a monorepo (instant propagation of internal changes).
