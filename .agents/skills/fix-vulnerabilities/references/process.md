# Process

1. **Match Node version**: `nvm use` (reads `.nvmrc`). If versions mismatch, audit/install results can differ from CI.
2. **Audit**: `pnpm audit` (add `--prod` to see only runtime-impacting issues first, since dev-only vulns rarely ship).
3. **Fix the safe way first**: `pnpm audit --fix`. This only applies fixes satisfiable within existing semver ranges — lowest risk.
4. **Re-audit**. For remaining findings, check each one individually:
   - `pnpm why <package>` to see if it's direct or a transitive dependency, and which workspace(s) pull it in.
   - Prefer bumping the **direct** dependency that pulls in the vulnerable transitive package, over pinning the transitive package directly.
   - If a fix requires a major/breaking bump, check that package's changelog before touching it.
5. **For a transitive-only vuln with no upgrade path**, use a targeted override in root `package.json` (pnpm's `pnpm.overrides` field) pinned to the patched version — not a blanket ignore.
6. **Install**: `pnpm install` to regenerate `pnpm-lock.yaml`.
7. **Verify after every round of changes, not just at the end**:
   - `pnpm build`
   - `pnpm check-types`
   - `pnpm lint`
   - `pnpm test` if the touched workspace has tests
   - If any step fails, that's a breaking change from the last bump — revert just that package's version and try a narrower fix (e.g. patch-level bump only, or an override instead of a direct upgrade) before moving on.
8. **Re-run `pnpm audit`** to confirm the finding is gone and no new ones appeared.
9. Report what changed: package, old → new version, direct vs. transitive/override, and confirmation that build/typecheck/lint/test passed.
