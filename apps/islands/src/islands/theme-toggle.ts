import type { Island } from "../island.ts";

const themes = ["system", "light", "dark"] as const;

// No framework: this enhances the button already in the HTML.
const island: Island = (el) => {
  const button = el.querySelector("button");
  if (!button) return;
  let index = 0;

  button.addEventListener("click", () => {
    index = (index + 1) % themes.length;
    const theme = themes[index]!;
    if (theme === "system") delete document.documentElement.dataset.theme;
    else document.documentElement.dataset.theme = theme;
    button.textContent = `Theme: ${theme}`;
    button.setAttribute("aria-pressed", String(theme !== "system"));
  });
};

export default island;
