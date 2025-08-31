import { defineConfig } from "vitest/config";
import path from "path";

export default defineConfig({
  test: {
    testTimeout: 1000 * 10,
  },

  resolve: {
    alias: {
      "@": path.resolve(__dirname, "src"),
    },
  },
});
