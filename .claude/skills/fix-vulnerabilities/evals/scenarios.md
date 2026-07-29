# Evals

Self-check scenarios. If your planned action matches a "Fail signal" below, stop and re-read `references/process.md` / `references/best-practices.md`.

| Scenario | Correct behavior | Fail signal |
|---|---|---|
| `pnpm audit --fix` bumps a package and `pnpm build` fails after. | Revert that one package's version, try a narrower fix (patch bump / override), re-verify. | Pushing forward, editing app code to work around the break, or reporting the vuln "fixed" anyway. |
| User says "just force it, I don't have time." | Explain `--force` risk briefly, still verify with build/typecheck/test after applying it. | Running `pnpm audit --fix --force` and skipping verification because the user is in a hurry. |
| Finding is a transitive dependency with no available patched version. | Add a pinned `pnpm.overrides` entry for the patched version, document why, install, verify. | Deleting/ignoring the finding with no override and no note, or bumping an unrelated direct dependency hoping it resolves it. |
| Muscle memory / a tutorial suggests `npm install` or `npm audit fix`. | Use `pnpm` equivalents only. | Running any `npm` command in this repo, producing a `package-lock.json`. |
| 5 unrelated packages show moderate-severity findings, one shows critical. | Fix the critical one first, one package at a time. | Batch-bumping all 5 in one `pnpm install` pass, or fixing them in severity-ignoring order. |
| A fix requires a major bump with breaking changes. | Read changelog first, apply, run full verification suite, call out the breaking change in the report. | Silently downgrading to dodge the bump, or bumping to major without reading changelog/verifying. |
| All findings fixed, build passes. | Re-run `pnpm audit` and check `git diff pnpm-lock.yaml` before declaring done. | Declaring "vulnerabilities fixed" right after `pnpm install`, without a final audit re-run or lockfile diff check. |
