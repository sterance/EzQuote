import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";

export default defineConfig(({ mode }) => {
  const isElectron = mode === "electron";
  return {
    base: isElectron ? "./" : "/",
    plugins: [react()],
    build: {
      chunkSizeWarningLimit: 1000,
      outDir: isElectron ? "dist-electron-renderer" : "dist",
    },
  };
});
