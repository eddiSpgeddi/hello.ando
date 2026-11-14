# AGENTS.md

Personal static site served by GitHub Pages (custom domain in `CNAME`).

- `src/` holds the site source: `index.html` loads Tailwind through the `@tailwindcss/browser` CDN script, and `styles.css` is a plain stylesheet.
- `.github/workflows/deploy.yml` builds `src/` into `dist/` on every push to `main` and deploys `dist/` to Pages. For now the build is a plain copy.
- `dist/` is build output and is gitignored. Don't edit it by hand.

## Rules

- **Colour contrast:** every colour must meet WCAG AA. See [docs/rules/colour-contrast.md](docs/rules/colour-contrast.md).

Project rules live in `docs/rules/`, one file per rule. When adding one, link it here and import it in `CLAUDE.md`.
