import { defineConfig } from "vitest/config";

export default defineConfig({
  // Vite 8 resolves the tsconfig `paths` aliases natively.
  resolve: { tsconfigPaths: true },
  test: {
    environment: "node",
    include: ["tests/unit/**/*.test.ts"],
    coverage: {
      provider: "v8",
      include: ["server/**/*.ts", "app/i18n/**/*.ts"],
      thresholds: {
        // Enforced on the code that carries product logic, not on glue.
        statements: 70,
        branches: 65,
        functions: 70,
        lines: 70,
      },
    },
  },
});
