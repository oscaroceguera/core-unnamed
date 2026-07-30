# @repo/assets

Static image assets (icons, illustrations, logos) for the JSConf México site. Part of [JSConfMx/core](../../README.md); consumed by `apps/web`.

## What is this?

Just SVG files under `images/`, re-exported via package `exports` so any app in the monorepo can import them directly:

```ts
import IconMainMx from "@repo/assets/images/icons/mainMx.svg";
import IconAxolotl from "@repo/assets/images/illustrations/axolotl.svg";
import IconPrimary from "@repo/assets/images/logos/primary.svg";
```

No build step — `exports` maps `./images/*` straight to the source files. Bundler/loader config for `.svg` imports lives in the consuming app.

## Structure

| Directory | Contents |
|---|---|
| `images/icons` | Small icon-sized SVGs |
| `images/illustrations` | Larger illustration SVGs |
| `images/logos` | Logo marks |
