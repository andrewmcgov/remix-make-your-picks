import { vitePlugin as remix } from "@remix-run/dev";
import { defineConfig } from "vite";
import path from "path";

export default defineConfig({
  plugins: [
    remix({
      // Transfer key settings from remix.config.js
      ignoredRouteFiles: [".*"],
      
      // Future flags carried over from remix.config.js
      future: {
        v3_relativeSplatPath: true,
        v3_fetcherPersist: true,
        v3_lazyRouteDiscovery: true,
        v3_singleFetch: true,
        v3_throwAbortReason: true,
      },
    }),
  ],
  
  // Path resolution for ~ alias
  resolve: {
    alias: {
      "~": path.resolve(__dirname, "app"),
    },
  },
  
  // Vite configuration for better performance
  build: {
    target: "esnext",
  },
  
  // Server configuration for development
  server: {
    port: 5173,
  },
});