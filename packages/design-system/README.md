# design-system

Design tokens and base element styles for hello.ando, written as plain CSS custom properties. It has no framework dependency and no build step.

Open [specimen.html](specimen.html) in a browser to see every token, with a light/dark toggle.

## Use it

```css
/* everything: tokens + base element styles */
@import "design-system";

/* or just the variables */
@import "design-system/tokens.css";
```

In a workspace app, add `"design-system": "workspace:*"` to its dependencies first. In a plain HTML page, link `src/index.css` directly.

## Fonts

Fonts are self-hosted, so pages don't need a font `<link>`. `src/fonts.css` is imported by `index.css`, or import `design-system/fonts.css` on its own.

- **Satoshi** (`--font-sans`): WOFF2 files in `src/fonts/`, converted from the Fontshare OTFs. Weights 300, 400, 500, 700 and 900, each with an italic. © Indian Type Foundry, [ITF Free Font License](https://fontshare.com/terms).
- **Outfit** is used only in the logo, and `apps/website/public/wordmark.svg` already has its letters converted to shapes. So no Outfit font files are shipped.

Browsers only download the faces a page uses.

## How it's organised

| File             | What it holds                                                                 |
| ---------------- | ----------------------------------------------------------------------------- |
| `src/fonts.css`  | `@font-face` rules for Satoshi                                                |
| `src/fonts/`     | Satoshi WOFF2 files                                                           |
| `src/tokens.css` | Primitives (`--gray-800`, `--green-600`) and semantic tokens (`--color-text`) |
| `src/base.css`   | Reset and element defaults, inside `@layer ds.base`                           |
| `src/index.css`  | Imports fonts, tokens and base                                                |

Use **semantic** tokens in site code. Primitives only exist so semantic tokens have something to point at. To retheme, change what a semantic token points to and leave the call sites alone.

`base.css` is in a cascade layer, so any unlayered app CSS beats it without extra specificity.

## Tokens

**Colour:** `--color-bg`, `--color-surface`, `--color-text`, `--color-text-muted`, `--color-accent` (green), `--color-accent-alt` (pink), `--color-highlight` (orange), `--color-on-accent`, `--color-danger`, `--color-border` (decorative only), `--color-border-strong` (controls), `--color-link`, `--color-focus`. **Logo:** `--logo-eye` (the o.o mark's eyes; the accent green in both themes).

**Typography:** `--font-sans`, `--font-mono`; sizes `--text-xs` to `--text-4xl` (fixed up to `2xl`, then fluid); `--leading-tight|snug|normal`; `--weight-light|regular|medium|bold`; `--tracking-tight|normal|wide`; `--measure` (65ch).

**Spacing:** `--space-0` to `--space-9` on a 4px base: 0, 4, 8, 12, 16, 24, 32, 48, 64, 96px.

**Layout:** `--container-sm|md|lg` (640/768/1024px), `--gutter` (fluid 16–32px).

**Shape:** `--radius-sm|md|lg|full`, `--border-width`, `--focus-ring-width`, `--focus-ring-offset`.

**Elevation:** `--shadow-sm|md`, `--z-base|raised|overlay|modal`.

**Motion:** `--duration-fast|base|slow` (all drop to 0ms under `prefers-reduced-motion`), `--ease-standard`, `--ease-out`.

**Breakpoints:** custom properties don't work inside `@media`, so these are a convention, not tokens: **40rem** (640px), **48rem** (768px), **64rem** (1024px), matching the container sizes.

## Light and dark

Colours use `light-dark()`, so they follow the system setting by default. To force a theme, set `data-theme="light"` or `data-theme="dark"` on `<html>`.

## Contrast

Every colour has to meet WCAG AA ([docs/rules/colour-contrast.md](../../docs/rules/colour-contrast.md)). [tests/contrast.test.ts](tests/contrast.test.ts) checks each semantic colour against `--color-bg` and `--color-surface` in both themes. It also fails if a new `--color-*` token isn't covered by a check, so add new colours to its pair lists.

Current ratios (light / dark):

| Token                                   | on bg         | on surface    |
| --------------------------------------- | ------------- | ------------- |
| `--color-text`                          | 14.67 / 13.45 | 13.45 / 11.66 |
| `--color-text-muted`                    | 6.26 / 7.24   | 5.74 / 6.28   |
| `--color-accent`                        | 5.27 / 12.21  | 4.83 / 10.59  |
| `--color-accent-alt`                    | 5.62 / 5.46   | 5.15 / 4.74   |
| `--color-highlight`                     | 5.02 / 7.91   | 4.60 / 6.86   |
| `--color-danger`                        | 5.66 / 6.40   | 5.19 / 5.55   |
| `--color-border-strong`                 | 3.77 / 3.89   | 3.46 / 3.37   |
| `--color-on-accent` on `--color-accent` | 5.27 / 12.21  | —             |
| `--logo-eye` (graphic, 3:1)             | 5.27 / 12.21  | 4.83 / 10.59  |

```bash
vp test
```
