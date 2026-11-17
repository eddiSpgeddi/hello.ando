import { describe, expect, test } from "vite-plus/test";
import { LOCKUP_LABEL, LOCKUP_PARTS, defineLockup } from "../src/index.ts";

describe("lockup", () => {
  test("parts spell out the label plus the prompt and cursor", () => {
    expect(LOCKUP_PARTS.join("")).toBe(`~/${LOCKUP_LABEL}_`);
  });

  test("defineLockup is a no-op without a DOM", () => {
    expect(() => defineLockup()).not.toThrow();
  });
});
