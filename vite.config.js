// vite.config.js
import { defineConfig } from "vite";
import glsl from "vite-plugin-glsl";
import path from "path";

const functionNamesToKeep = ["setupBridge"];
const keepFnamesRegex = new RegExp(
  functionNamesToKeep.map((name) => `^${name}$`).join("|"),
);

/// <reference types="vitest" />
export default defineConfig({
  test: {},
  plugins: [glsl()],
  optimizeDeps: {
    esbuildOptions: {
      target: "esnext",
      supported: {
        "top-level-await": true,
      },
    },
  },
  build: {
    minify: "terser",
    target: "esnext",
    terserOptions: {
      module: true,
      toplevel: true,
      keep_fnames: keepFnamesRegex,
      keep_classnames: false,
    },
    assetsDir: "assets",
    rollupOptions: {
      output: {
        assetFileNames: "assets/[name]-[hash][extname]",
        manualChunks: {},
      },
    },
    assetsInclude: ["src/assets/*.png"],
    resolve: {
      alias: {
        // Create an alias for the assets path if needed
        "@assets": path.resolve(__dirname, "./public/assets"),
      },
    },
  },
});
