import { defineConfig } from "vite-plus";

export default defineConfig({
  fmt: {
    ignorePatterns: [
      "**/node_modules/**",
      "**/dist/**",
      "**/build/**",
      ".vscode/**",
      ".idea/**",
      ".git/**",
    ],
    sortPackageJson: true,
    insertFinalNewline: true,
  },
  lint: {
    jsPlugins: [{ name: "vite-plus", specifier: "vite-plus/oxlint-plugin" }],
    rules: { "vite-plus/prefer-vite-plus-imports": "error" },
    options: { typeAware: true, typeCheck: true, reportUnusedDisableDirectives: "error" },
  },
  run: {
    cache: true,
  },
});
