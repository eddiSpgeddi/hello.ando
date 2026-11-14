# Colour contrast

Every colour suggested or added to this site must meet WCAG AA contrast against the background it actually sits on:

- **4.5:1** for normal text
- **3:1** for large text (24px and up, or 18.66px and up when bold) and for UI components and graphics

## How to apply

- Calculate the contrast ratio. Don't judge it by eye.
- Check against the real background, in both light and dark mode. This site uses `bg-white` in light mode and Tailwind `gray-800` in dark mode.
- Show the ratio next to each colour you suggest.
- If a colour fails, adjust it until it passes before suggesting it, or clearly flag that it fails.
