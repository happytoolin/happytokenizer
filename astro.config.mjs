// @ts-check
import partytown from "@astrojs/partytown";
import react from "@astrojs/react";
import sitemap from "@astrojs/sitemap";
import tailwindcss from "@tailwindcss/vite";
import { defineConfig } from "astro/config";

import cloudflare from "@astrojs/cloudflare";

// https://astro.build/config
export default defineConfig({
  site: "https://happytokenizer.com",

  integrations: [
    react(),
    sitemap({
      changefreq: "weekly",
      priority: 0.7,
      lastmod: new Date(),
    }),
    partytown({
      config: {
        forward: ["dataLayer.push", "gtag"],
      },
    }),
  ],

  vite: {
    plugins: [tailwindcss()],
    build: {
      rollupOptions: {
        output: {
          manualChunks: (id) => {
            if (id.includes("react") || id.includes("react-dom")) {
              return "vendor-react";
            }
            if (id.includes("@radix-ui")) {
              return "vendor-ui";
            }
            if (
              id.includes("clsx") ||
              id.includes("tailwind-merge") ||
              id.includes("class-variance-authority")
            ) {
              return "vendor-utils";
            }
            if (id.includes("@tanstack/react-virtual")) {
              return "vendor-virtual";
            }
            if (id.includes("lucide-react")) {
              return "vendor-icons";
            }
            if (id.includes("components/react/TokenizerApp")) {
              return "components-critical";
            }
            if (id.includes("components/react/TokenDisplay")) {
              return "components-secondary";
            }
            if (id.includes("components/ui/StatusDisplay")) {
              return "status-display";
            }
          },
        },
      },
      chunkSizeWarningLimit: 500, // Lower threshold to catch large chunks
    },
    optimizeDeps: {
      include: ["react", "react-dom"],
    },
    // Configure worker handling to avoid tokenizer in server build
    worker: {
      format: "es",
    },
  },

  adapter: cloudflare({
    platformProxy: {
      enabled: true,
    },
    imageService: "cloudflare",
  }),
});
