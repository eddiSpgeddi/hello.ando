# islands

An example of Astro-style islands in a plain HTML page, built with Vite. One page mixes three islands:

| Island         | Framework | Loads when                    |
| -------------- | --------- | ----------------------------- |
| `counter`      | Svelte    | the browser is idle           |
| `log`          | React     | it scrolls into view          |
| `theme-toggle` | plain TS  | it's first hovered or focused |

```bash
vp run islands#dev     # from the repo root
vp run islands#build   # then check dist/assets: one chunk per framework
```

## How it works

- `index.html` marks each island with `data-island`, `data-load` and optional `data-props` (JSON). Whatever HTML is inside shows until the island mounts.
- `src/islands.ts` is the loader. It waits for each island's trigger, then imports its module with `import()`. Vite splits every import into its own chunk, so React and Svelte only download if the page uses them.
- Each module in `src/islands/` default-exports `mount(el, props)` (the `Island` type in `src/island.ts`) and uses its framework's own API to render into `el`.
- `vite.config.ts` loads the React and Svelte plugins side by side.

To add an island: create `src/islands/<name>.ts(x)` that exports an `Island`, add it to the registry in `src/islands.ts`, and put a `data-island="<name>"` element in the HTML.

## Limits compared with Astro

- Nothing is server-rendered. Fallback HTML inside the island is all that's visible before JS, so write meaningful fallbacks.
- Islands can't share state or context. They talk through DOM events (`counter:change` here). An island that loads late misses events fired before it mounted.
- `data-props` is unchecked JSON. Validate or coerce it in `mount`.
- Plain HTML has no layouts, so shared markup is repeated per page.
