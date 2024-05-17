// vite.config.js
import { defineConfig } from "vite";
import glsl from "vite-plugin-glsl";
import path from "path";

const functionNamesToKeep = ["initSoldo"];
const keepFnamesRegex = new RegExp(
  functionNamesToKeep.map((name) => `^${name}$`).join("|"),
);

export default defineConfig({
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
      keep_fnames: keepFnamesRegex,
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
