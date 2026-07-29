# @repo/ui

Shared React 19 component library and Tailwind CSS 4 styles for the JSConf México monorepo. Part of [JSConfMx/core](../../README.md); consumed by `apps/web`.

## What is this?

- Components compile from `src/*` to `dist/*` via `tsc`; consumers import them as `@repo/ui/<ComponentName>`
- Styles compile from `src/styles.css` to `dist/index.css` via the Tailwind CLI; consumers import them once as `@repo/ui/styles.css`
- All of this package's Tailwind classes use the `ui:` prefix (`@import "tailwindcss" prefix(ui)` in `src/styles.css`) so they don't collide with a consuming app's own Tailwind classes
- Built on `@repo/tailwind-config` (base Tailwind import) and `tailwind-merge` (for the `sx` override prop pattern below)

### Components

| Component | Import | Description |
|---|---|---|
| `Card` | `@repo/ui/Card` | Bordered container with a `title`, a `color` variant (`primary` \| `secondary` \| `tertiary` \| `default`), and an `sx` prop merged in via `tailwind-merge` |

```tsx
import { Card } from "@repo/ui/Card";

<Card title="Checkout" color="secondary" sx="w-full md:w-2xl mx-auto">
  <p>Content goes here.</p>
</Card>;
```

## Setup in a consuming app

```ts
// app/layout.tsx (or equivalent root layout)
import "@repo/ui/styles.css";
```

`react` (`^19`) is a peer dependency — the consuming app supplies it.

## Scripts

| Command | Description |
|---|---|
| `pnpm build:components` | Compile components with `tsc` |
| `pnpm build:styles` | Compile Tailwind styles to `dist/index.css` |
| `pnpm dev:components` | Watch mode for components (`tsc --watch`) |
| `pnpm dev:styles` | Watch mode for styles |
| `pnpm check-types` | Type-check with `tsc --noEmit` |
| `pnpm lint` | Lint `src` with `@repo/eslint-config` (`--max-warnings 0`) |
