// @ts-check
import { defineConfig } from "astro/config";
import starlight from "@astrojs/starlight";
import starlightTheme from "starlight-theme-nova";
import stylex from "vite-plugin-stylex";
import icon from "astro-icon";

import tailwindcss from "@tailwindcss/vite";

import react from "@astrojs/react";

export default defineConfig({
  integrations: [
    icon(),
    starlight({
      title: "RUNY",
      logo: {
        src: "./src/assets/runy.png",
        replacesTitle: true,
      },
      plugins: [starlightTheme()],
      customCss: ["./src/styles/global.css"],
      social: [
        {
          icon: "github",
          label: "GitHub",
          href: "https://github.com/s-panferov/runy",
        },
      ],
      sidebar: [
        {
          label: "Guides",
          items: [
            // Each item here is one entry in the navigation menu.
            { label: "Installation", slug: "guides/installation" },
          ],
        },
        {
          label: "Reference",
          autogenerate: { directory: "reference" },
        },
      ],
    }),
    react(),
  ],

  vite: {
    // @ts-ignore
    plugins: [tailwindcss()],
  },
});
