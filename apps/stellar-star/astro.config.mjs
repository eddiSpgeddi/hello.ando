// @ts-check
import { defineConfig } from "astro/config";

/**
 * The lockup previews are for local design work only: inject their routes in
 * `astro dev` so `astro build` never ships them.
 * @type {import("astro").AstroIntegration}
 */
const devPreviews = {
  name: "dev-previews",
  hooks: {
    "astro:config:setup": ({ command, injectRoute }) => {
      if (command !== "dev") return;
      injectRoute({ pattern: "/lockup", entrypoint: "./src/previews/lockup.astro" });
      injectRoute({
        pattern: "/lockup-animation",
        entrypoint: "./src/previews/lockup-animation.astro",
      });
    },
  },
};

// https://astro.build/config
export default defineConfig({
  integrations: [devPreviews],
});
