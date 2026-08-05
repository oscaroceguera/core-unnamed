# Structure Template

`{{PACKAGE_NAME}}` — kebab-case, either given by the user or asked for (e.g. `analytics`, `feature-flags`).

## Directory layout

```
packages/{{PACKAGE_NAME}}/
  package.json
  tsconfig.json
  src/
    index.ts
```

## `package.json`

```json
{
  "name": "@repo/{{PACKAGE_NAME}}",
  "private": true,
  "type": "module",
  "exports": {
    ".": {
      "types": "./src/index.ts",
      "default": "./dist/index.js"
    }
  },
  "scripts": {
    "dev": "tsc --watch",
    "build": "tsc",
    "check-types": "tsc --noEmit"
  },
  "devDependencies": {
    "@repo/typescript-config": "workspace:*",
    "@types/node": "^24",
    "typescript": "^5.9.2"
  }
}
```

If the package needs runtime dependencies (e.g. an SDK), add them under `dependencies` — mirror how `packages/stripe` depends on `stripe` and `packages/mailer` depends on `nodemailer` / `@aws-sdk/client-sesv2`.

## `tsconfig.json`

```json
{
  "extends": "@repo/typescript-config/base.json",
  "compilerOptions": {
    "outDir": "dist",
    "rootDir": "src"
  },
  "include": ["src"],
  "exclude": ["node_modules", "dist"]
}
```

## `src/index.ts`

Minimal placeholder (empty export or a placeholder function) so `tsc` has something to build.
