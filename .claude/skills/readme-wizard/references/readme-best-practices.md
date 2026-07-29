# README Best Practices

## Table of Contents

- [Structure and Order](#structure-and-order)
- [Writing Tone](#writing-tone)
- [Adapting to Project Type](#adapting-to-project-type)
- [Badge Best Practices](#badge-best-practices)
- [Common Pitfalls](#common-pitfalls)

## Structure and Order

Follow the README Structure order defined in SKILL.md — hero and badges first so the reader knows what the project is and its health status before anything else; Quick Start early (readers decide whether to keep reading based on how fast they can try it); Contributing/social/star-history last, since they matter to contributors more than first-time visitors.

**Not every project needs every section.** A solo-maintainer CLI script doesn't need a contributor grid. An internal tool doesn't need star history or social badges. A library with no CI configured doesn't get a CI badge. Fewer, honest sections beat a full template padded with irrelevant ones — see Adapting to Project Type.

## Writing Tone

Concrete and specific, active voice, no unverifiable superlatives.

| Bad | Good |
|---|---|
| "A powerful, blazing-fast, next-generation testing framework that revolutionizes how you test." | "Runs your test suite against real DOM snapshots and diffs render output to catch visual regressions." |
| "This tool makes things easier and more efficient." | "Cuts a 400-line YAML config down to 20 lines by inferring defaults from your file structure." |
| "npm install <package> # or however you install things" | "\`\`\`bash\npnpm install\npnpm dev\n\`\`\`" (exact, copy-pasteable, matches the detected package manager) |

If a claim can't be grounded in something detectable in the repo (a benchmark, a real feature, an actual dependency), cut it rather than asserting it.

## Adapting to Project Type

| Project type | Emphasize | Skip or de-emphasize |
|---|---|---|
| **Library / framework** | Installation via the real package manager, minimal runnable usage example, version + CI + license badges, link to full API docs | Star history if the repo is new; heavy screenshots |
| **Web app** | Live demo / deploy link, screenshot or GIF near the top, tech stack badges, deployment instructions | Project structure tree (less useful to end users than to contributors) |
| **Documentation repo** | Navigation / table of contents up front, how the docs are organized, how to contribute a doc change | Quick Start / install (often doesn't apply); usually just a license badge, if any |
| **Small utility / script** | One tight Quick Start block, single clear usage example | Contributor grid, star history, social badges, multi-section structure — keep it to a few sections total |
| **Monorepo** | A workspace/package table (name, path, description, version), root README linking out to each package's own README, structure tree showing all packages | A single flat Quick Start — point to per-package instructions instead |

## Badge Best Practices

Exact URL formats, categories (status/social/extras), and `{{PLACEHOLDER}}` definitions live in `../assets/badges.json` — read it when assembling badge rows. Never leave a `{{PLACEHOLDER}}` unresolved in rendered output; only include a badge whose placeholders resolve to real, detected values (see Step 1 in SKILL.md).

## Common Pitfalls

- **Placeholder text left in** — `OWNER/REPO`, `TODO`, lorem ipsum shipped in the final README instead of resolved from the detected git remote/facts.
- **Fabricated badges** — a version badge with no releases, a CI badge with no workflow file, a social badge for a channel/server that was never found in the repo.
- **Outdated install commands** — commands recalled from memory or a similar project instead of read from the actual manifest/lockfile in this repo.
- **Generic descriptions** — marketing copy ("powerful", "seamless", "next-gen") that could describe any project, instead of the repo's actual, specific purpose.
- **Overly long READMEs for simple projects** — a 12-section README for a 30-line script; match section count to project size, per Adapting to Project Type.
- **Missing Quick Start** — forcing a reader to hunt through prose for the install/run commands instead of giving them a copy-pasteable block early.
