import { defineConfig } from "vite";

export default defineConfig({
  base: "/time/",
  server: {
    port: 3000,
    open: true,
  },
  build: {
    outDir: "dist",
    assetsDir: "assets",
    rollupOptions: {
      output: {
        assetFileNames: "assets/[name].[ext]",
      },
    },
  },
  assetsInclude: ["**/*.mp3", "**/*.wav", "**/*.ogg"],
});
