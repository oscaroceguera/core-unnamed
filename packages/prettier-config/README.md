# @repo/prettier-config

Shared Prettier config for the JSConf México monorepo. Part of [JSConfMx/core](../../README.md); consumed by the root `pnpm format` script.

## What is this?

A single exported config (`prettier.config.js`):

- `semi: true`, `singleQuote: false`, `tabWidth: 2`, `trailingComma: "es5"`, `printWidth: 80`
- `@ianvs/prettier-plugin-sort-imports` — groups imports as React → Next.js → third-party → blank line → `@/*` → relative (`./`, `../`)
- `prettier-plugin-tailwindcss` — sorts Tailwind classes; also picks up class names inside `clsx`, `cn`, and `cva` calls

`prettier` (`^3.7.4`) is a peer dependency — the consumer supplies it.

## Usage

```js
// prettier.config.js
import config from "@repo/prettier-config";

export default config;
```

Or from the command line, as the root does:

```bash
pnpm format   # prettier --write "**/*.{ts,tsx,md}"
```
