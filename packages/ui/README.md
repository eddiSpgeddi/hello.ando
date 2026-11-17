# ui

Components for hello.ando. They use no framework: each one is a CSS class plus an optional TypeScript helper that builds the element. Styles use [design-system](../design-system/README.md) semantic tokens only. The package ships as source, so it has no build step, and Vite compiles it as part of the app.

## Use it

Add `"ui": "workspace:*"` to the app's dependencies, then:

```css
@import "design-system"; /* tokens first */
@import "ui/styles.css";
```

```ts
import { createButton, buttonClass } from "ui";

document.body.append(createButton({ label: "Save", variant: "primary" }));

// or in an HTML string
const html = `<button class="${buttonClass("primary")}">Save</button>`;
```

## Components

| Component | Classes                                                                        | Helpers                       |
| --------- | ------------------------------------------------------------------------------ | ----------------------------- |
| Button    | `.ui-button`, `.ui-button--primary` (default: secondary), `.ui-button--icon` ¹ | `createButton`, `buttonClass` |
| Lockup    | `<ui-lockup>` custom element (adds `.ui-lockup`) ²                             | `defineLockup`                |

¹ `.ui-button--icon` is a square, icon-only size that combines with either variant. Put an `<svg aria-hidden="true">` inside and give the button an `aria-label`.

² Importing `"ui"` registers `<ui-lockup>`, so write `<ui-lockup></ui-lockup>` in HTML and it renders the `~/hello.ando_` wordmark. Screen readers announce it as "hello.ando". It uses Fira Code or JetBrains Mono if the page loads them, otherwise `--font-mono`. Set `font-size` in app CSS to resize it. The cursor stops blinking when the user has reduced motion turned on.

## Adding a component

1. Create `src/<name>/<name>.css` and `src/<name>/<name>.ts`.
2. Wrap the CSS in `@layer ds.components { … }` and prefix classes with `ui-`.
3. Import the CSS in `src/styles.css` and export the TS from `src/index.ts`.
4. Use semantic tokens only. For private variables inside a component, prefix them `--_` (for example `--_pad`).

## Rules the tests enforce

`tests/tokens.test.ts` scans every `.css` file in `src/` and fails if one:

- hard-codes a colour (`#hex`, `rgb()`, `hsl()`, `oklch()` …)
- references a token that `design-system` doesn't define
- uses a primitive (`--gray-800`) instead of a semantic token

Colour pairs still have to meet WCAG AA ([docs/rules/colour-contrast.md](../../docs/rules/colour-contrast.md)). Pair text and backgrounds the way the design-system contrast table does, for example `--color-on-accent` on `--color-accent`.

```bash
vp test
```
