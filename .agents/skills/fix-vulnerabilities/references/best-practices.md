# Best Practices

- **Triage by severity first**: fix critical/high before moderate/low. Don't burn a session on a low-severity dev-only dependency while a high-severity runtime one waits.
- **One package per change**: bump/override one vulnerable package at a time, verify, then move to the next. Batching multiple bumps together makes it hard to tell which one broke the build.
- **Read the changelog/release notes before a major bump**, not after — look for removed APIs, changed defaults, or ESM/CJS shifts that `pnpm audit --fix` can't foresee.
- **Check the lockfile diff** (`git diff pnpm-lock.yaml`) before committing — confirm only the expected package(s) moved, not a wide unrelated resolution shuffle.
- **Prefer the smallest version bump that resolves the CVE** (patch > minor > major) over jumping to `latest`.
- **Never suppress a finding without a paper trail**: if a vuln is a false positive or genuinely unreachable (e.g. vulnerable code path never invoked), document why in the commit message or a `pnpm.auditConfig` ignore with a comment — don't just drop it silently.
- **Re-run the full verification suite (build/check-types/lint/test) once at the very end too**, after all individual bumps, to catch cross-package interaction issues no single bump surfaced.
- **Commit vulnerability fixes separately from feature work** so they're easy to revert in isolation if something slips through.

## Guardrails

- Never run `npm audit fix` or `npm install` in this repo — it writes a `package-lock.json` that conflicts with `pnpm-lock.yaml`.
- Never use `--force` on `pnpm audit --fix` as a first move — it ignores semver and is far more likely to break the app; only reach for it after the safe fix + targeted bump both fail, and only for the specific package left over.
- Don't leave a vulnerability "fixed" without having run build/typecheck/lint (and tests where present) afterward — an audit passing is not the same as the app working.
- Don't silently downgrade a package to dodge a vuln; if no non-breaking fix exists, say so and let the user decide on the breaking bump.
