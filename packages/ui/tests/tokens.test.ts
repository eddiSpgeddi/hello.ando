// Component CSS must use design-system's semantic tokens: no hard-coded
// colours, no primitives (--gray-800), and no tokens that don't exist.
import { readFileSync, readdirSync } from "node:fs";
import { createRequire } from "node:module";
import { describe, expect, test } from "vite-plus/test";

const require = createRequire(import.meta.url);
const tokensCss = readFileSync(require.resolve("design-system/tokens.css"), "utf8");

const defined = new Set<string>();
const primitives = new Set<string>();
for (const [, name, value] of tokensCss.matchAll(/(--[\w-]+)\s*:\s*([^;]+);/g)) {
  defined.add(name!);
  // a primitive is a token whose value is a raw colour, not a reference
  if (/^#[0-9a-f]{3,8}$/i.test(value!.trim())) primitives.add(name!);
}

const srcDir = new URL("../src/", import.meta.url);
const cssFiles = readdirSync(srcDir, { recursive: true, encoding: "utf8" }).filter((f) =>
  f.endsWith(".css"),
);

describe.each(cssFiles)("%s", (file) => {
  const css = readFileSync(new URL(file, srcDir), "utf8").replace(/\/\*[\s\S]*?\*\//g, "");

  test("has no hard-coded colours", () => {
    expect(css.match(/#[0-9a-f]{3,8}\b|\b(?:rgba?|hsla?|oklch|lab)\(/gi) ?? []).toEqual([]);
  });

  test("only uses semantic tokens that exist", () => {
    const used = [...css.matchAll(/var\((--[\w-]+)/g)].map((m) => m[1]!);
    // --_name is a component-private variable defined in the same file
    const external = used.filter((name) => !name.startsWith("--_"));
    expect(external.filter((name) => !defined.has(name))).toEqual([]);
    expect(external.filter((name) => primitives.has(name))).toEqual([]);
  });
});
