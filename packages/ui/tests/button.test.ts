import { describe, expect, test } from "vite-plus/test";
import { buttonClass } from "../src/index.ts";

describe("buttonClass", () => {
  test("defaults to secondary", () => {
    expect(buttonClass()).toBe("ui-button");
  });

  test("adds a modifier for primary", () => {
    expect(buttonClass("primary")).toBe("ui-button ui-button--primary");
  });
});
