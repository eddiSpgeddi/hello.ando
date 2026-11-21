// Cycles the page theme: system → light → dark. The choice is stored in
// localStorage, and an inline script in index.html applies it before first
// paint so a returning visitor doesn't see a flash of the other theme.
// Design-system tokens follow `data-theme` on <html>, and so does the
// wordmark, which reads those tokens through <use>.

const STORAGE_KEY = "theme";
const themes = ["system", "light", "dark"] as const;
type Theme = (typeof themes)[number];

const labels: Record<Theme, string> = { system: "System", light: "Light", dark: "Dark" };

// 24×24 stroke icons drawn in currentColor, so they follow the button's text colour.
const svg = (body: string) =>
  `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false">${body}</svg>`;

const icons: Record<Theme, string> = {
  // monitor
  system: svg(`<rect x="3" y="4" width="18" height="12" rx="2"/><path d="M8 20h8M12 16v4"/>`),
  // sun
  light: svg(
    `<circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4"/>`,
  ),
  // moon
  dark: svg(`<path d="M20 14.5A8 8 0 1 1 9.5 4a6.5 6.5 0 0 0 10.5 10.5z"/>`),
};

function readTheme(): Theme {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored === "light" || stored === "dark") return stored;
  } catch {
    // storage blocked (private mode, disabled site data): fall back to system
  }
  return "system";
}

function applyTheme(theme: Theme): void {
  const root = document.documentElement;
  if (theme === "system") delete root.dataset.theme;
  else root.dataset.theme = theme;
  try {
    if (theme === "system") localStorage.removeItem(STORAGE_KEY);
    else localStorage.setItem(STORAGE_KEY, theme);
  } catch {
    // the theme still applies for this visit
  }
}

/** Wires up a theme button already in the HTML and reveals it. */
export function initThemeToggle(button: HTMLButtonElement): void {
  let current = readTheme();

  const render = () => {
    const label = `Theme: ${labels[current]}`;
    // icon-only, so the name goes in aria-label, and title gives sighted users a tooltip
    button.innerHTML = icons[current];
    button.setAttribute("aria-label", label);
    button.title = label;
  };

  button.addEventListener("click", () => {
    current = themes[(themes.indexOf(current) + 1) % themes.length]!;
    applyTheme(current);
    render();
  });

  render();
  button.hidden = false;
}
