# @repo/eslint-config

Shared ESLint flat-config presets for the JSConf México monorepo. Part of [JSConfMx/core](../../README.md); consumed by `apps/web` and `@repo/ui`.

## What is this?

Three exports, each an array of flat-config objects:

| Export | File | For |
|---|---|---|
| `@repo/eslint-config/base` | `base.js` | Baseline: `@eslint/js` recommended, `typescript-eslint` recommended, `eslint-config-prettier`, Turborepo's `no-undeclared-env-vars` rule, `eslint-plugin-only-warn` (downgrades all errors to warnings), ignores `dist/**` |
| `@repo/eslint-config/next-js` | `next.js` | Base config + `eslint-plugin-react` recommended, `@next/eslint-plugin-next` (`recommended` + `core-web-vitals`), `eslint-plugin-react-hooks`, ignores `.next/**`, `out/**`, `build/**`, `next-env.d.ts` |
| `@repo/eslint-config/react-internal` | `react-internal.js` | Base config + `eslint-plugin-react` recommended, `eslint-plugin-react-hooks`, for React packages that aren't Next.js apps |

## Usage

```js
// eslint.config.mjs
import { nextJsConfig } from "@repo/eslint-config/next-js";

export default nextJsConfig;
```

```js
// eslint.config.mjs (non-Next.js React package)
import { config } from "@repo/eslint-config/react-internal";

export default config;
```
