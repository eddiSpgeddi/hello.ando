import { svelte } from "@sveltejs/vite-plugin-svelte";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vite-plus";

// One build, several frameworks. Each plugin only handles its own file types.
// If you add a second JSX framework (Preact, Solid), give each an `include`
// so they don't both try to compile the same .tsx files.
export default defineConfig({
  plugins: [react({ include: /\.tsx$/ }), svelte()],
});
