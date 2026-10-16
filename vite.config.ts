import { cloudflare } from "@cloudflare/vite-plugin";
import { reactRouter } from "@react-router/dev/vite";
import tailwindcss from "@tailwindcss/vite";
import { defineConfig } from "vite";

export default defineConfig({
  // Vite 8 resolves the tsconfig `paths` aliases natively — no plugin needed.
  resolve: { tsconfigPaths: true },
  plugins: [
    // The Cloudflare plugin runs the app in workerd during dev, so local dev
    // behaves like production instead of like Node.
    cloudflare({ viteEnvironment: { name: "ssr" } }),
    tailwindcss(),
    reactRouter(),
  ],
  build: {
    // Fail the build if a client chunk grows past this — a silent regression
    // here is what quietly breaks the LCP budget.
    chunkSizeWarningLimit: 250,
  },
});
