import "./style.css";
import { initThemeToggle } from "./theme-toggle.ts";

const themeButton = document.querySelector<HTMLButtonElement>("#theme-toggle");
if (themeButton) initThemeToggle(themeButton);
