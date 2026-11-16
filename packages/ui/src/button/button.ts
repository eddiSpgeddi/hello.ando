export type ButtonVariant = "primary" | "secondary";

export interface ButtonOptions {
  label: string;
  variant?: ButtonVariant;
  type?: "button" | "submit" | "reset";
  onClick?: (event: MouseEvent) => void;
}

/** Class string for a button, for markup written as HTML. */
export function buttonClass(variant: ButtonVariant = "secondary"): string {
  return variant === "secondary" ? "ui-button" : `ui-button ui-button--${variant}`;
}

/** Builds a styled <button>. Needs ui/styles.css on the page. */
export function createButton({
  label,
  variant = "secondary",
  type = "button",
  onClick,
}: ButtonOptions): HTMLButtonElement {
  const button = document.createElement("button");
  button.type = type;
  button.className = buttonClass(variant);
  button.textContent = label;
  if (onClick) button.addEventListener("click", onClick);
  return button;
}
