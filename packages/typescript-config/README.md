# @repo/typescript-config

Shared base `tsconfig.json` files for the JSConf México monorepo. Part of [JSConfMx/core](../../README.md); consumed by `apps/web`, `@repo/database`, `@repo/mailer`, `@repo/stripe`, and `@repo/ui`.

## What is this?

| File | Extends | For |
|---|---|---|
| `base.json` | — | Strict ES2022/NodeNext baseline: `strict`, `noUncheckedIndexedAccess`, `isolatedModules`, `moduleDetection: force`, declaration output enabled |
| `nextjs.json` | `base.json` | Next.js apps — `Bundler` resolution, `jsx: preserve`, `noEmit`, the `next` TS plugin |
| `react-library.json` | `base.json` | React component packages — adds `jsx: react-jsx` |

## Usage

```json
// tsconfig.json
{
  "extends": "@repo/typescript-config/base.json"
}
```

Apps and packages extend the file that matches their shape and layer on their own `outDir`/`rootDir`/`include`, e.g. `apps/web` extends `nextjs.json`, `@repo/ui` extends `react-library.json`, and `@repo/database`/`@repo/mailer`/`@repo/stripe` extend `base.json` directly.
