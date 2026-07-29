# @repo/tailwind-config

Shared Tailwind CSS 4 config for the JSConf México monorepo. Part of [JSConfMx/core](../../README.md); consumed by `apps/web` and `@repo/ui`.

## What is this?

Two exports:

| Export | File | Contents |
|---|---|---|
| `@repo/tailwind-config` | `shared-styles.css` | `@import "tailwindcss";` — the base Tailwind entrypoint |
| `@repo/tailwind-config/postcss` | `postcss.config.js` | `postcssConfig` object wiring up `@tailwindcss/postcss` |

## Usage

```css
/* app/globals.css */
@import "tailwindcss";
@import "@repo/tailwind-config";
```

```js
// postcss.config.mjs
import { postcssConfig } from "@repo/tailwind-config/postcss";

export default postcssConfig;
```

`@repo/ui` layers a Tailwind prefix on top of this import (`@import "tailwindcss" prefix(ui)`) so its component classes don't collide with a consuming app's own Tailwind classes — see [`@repo/ui`](../ui/README.md).
