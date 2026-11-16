// Enforces docs/rules/colour-contrast.md: every semantic text/UI colour must
// meet WCAG AA against each background it can sit on, in both themes.
import { readFileSync } from "node:fs";
import { describe, expect, test } from "vite-plus/test";

type Theme = "light" | "dark";

const css = readFileSync(new URL("../src/tokens.css", import.meta.url), "utf8").replace(
  /\/\*[\s\S]*?\*\//g,
  "",
);

// first declaration wins, so the reduced-motion overrides etc. are ignored
const declarations = new Map<string, string>();
for (const [, name, value] of css.matchAll(/(--[\w-]+)\s*:\s*([^;]+);/g)) {
  if (!declarations.has(name!)) declarations.set(name!, value!.trim());
}

function resolve(name: string, theme: Theme): string {
  const value = declarations.get(name);
  if (value === undefined) throw new Error(`unknown token ${name}`);
  return resolveValue(value, theme);
}

function resolveValue(value: string, theme: Theme): string {
  const lightDark = value.match(/^light-dark\((.+),\s*(var\([^)]+\)|#[0-9a-f]+)\)$/i);
  if (lightDark) return resolveValue(theme === "light" ? lightDark[1]! : lightDark[2]!, theme);
  const ref = value.match(/^var\((--[\w-]+)\)$/);
  if (ref) return resolve(ref[1]!, theme);
  if (/^#[0-9a-f]{6}$/i.test(value)) return value.toLowerCase();
  throw new Error(`can't resolve colour value "${value}"`);
}

function luminance(hex: string): number {
  const n = Number.parseInt(hex.slice(1), 16);
  const [r, g, b] = [n >> 16, (n >> 8) & 255, n & 255].map((c) => {
    const s = c / 255;
    return s <= 0.03928 ? s / 12.92 : ((s + 0.055) / 1.055) ** 2.4;
  });
  return 0.2126 * r! + 0.7152 * g! + 0.0722 * b!;
}

function contrast(a: string, b: string): number {
  const [hi, lo] = [luminance(a), luminance(b)].sort((x, y) => y - x);
  return (hi! + 0.05) / (lo! + 0.05);
}

const TEXT = 4.5;
const UI = 3;

// [foreground, minimum ratio]
const onBackgrounds: [string, number][] = [
  ["--color-text", TEXT],
  ["--color-text-muted", TEXT],
  ["--color-accent", TEXT],
  ["--color-accent-alt", TEXT],
  ["--color-highlight", TEXT],
  ["--color-danger", TEXT],
  ["--color-link", TEXT],
  ["--color-border-strong", UI],
  ["--color-focus", UI],
  ["--logo-eye", UI], // graphic, not text
];
const backgrounds = ["--color-bg", "--color-surface"];

// foregrounds that sit on something other than the page backgrounds
const otherPairs: [string, string, number][] = [["--color-on-accent", "--color-accent", TEXT]];

describe.each<Theme>(["light", "dark"])("%s theme", (theme) => {
  for (const bg of backgrounds) {
    test.each(onBackgrounds)(`%s on ${bg} meets %d:1`, (fg, min) => {
      expect(contrast(resolve(fg, theme), resolve(bg, theme))).toBeGreaterThanOrEqual(min);
    });
  }

  test.each(otherPairs)("%s on %s meets %d:1", (fg, bg, min) => {
    expect(contrast(resolve(fg, theme), resolve(bg, theme))).toBeGreaterThanOrEqual(min);
  });
});

test("every semantic colour token is covered by a contrast check", () => {
  const checked = new Set([
    ...onBackgrounds.map(([fg]) => fg),
    ...backgrounds,
    ...otherPairs.flatMap(([fg, bg]) => [fg, bg]),
    "--color-border", // decorative, exempt
  ]);
  const semantic = [...declarations.keys()].filter((name) => name.startsWith("--color-"));
  expect(semantic.filter((name) => !checked.has(name))).toEqual([]);
});
