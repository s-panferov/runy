// @ts-check
import { defineConfig } from "astro/config";
import starlight from "@astrojs/starlight";
import starlightTheme from "starlight-theme-nova";
import icon from "astro-icon";

import tailwindcss from "@tailwindcss/vite";

import react from "@astrojs/react";

import d2 from "astro-d2";

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
            { label: "Workspace", slug: "guides/workspace" },
            { label: "Process", slug: "guides/process" },
            { label: "Service", slug: "guides/service" },
            { label: "Web Console", slug: "guides/web-console" },
            { label: "Daemon", slug: "guides/daemon" },
          ],
        },
        {
          label: "SDK",
          items: [
            { label: "Getting Started", slug: "sdk/getting-started" },
            { label: "Service Lifecycle", slug: "sdk/service-lifecycle" },
          ],
        },
      ],
    }),
    react(),
    d2({
      sketch: true,
      skipGeneration: true,
    }),
  ],

  vite: {
    // @ts-ignore
    plugins: [tailwindcss()],
  },
});
