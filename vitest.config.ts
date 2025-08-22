import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    testTimeout: 1000 * 10,
    include: ["tests/**/*.spec.ts"],
  },
});
