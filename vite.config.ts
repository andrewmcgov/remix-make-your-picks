import { vitePlugin as remix } from "@remix-run/dev";
import { defineConfig } from "vite";
import path from "path";

export default defineConfig({
  plugins: [
    remix({
      // Transfer key settings from remix.config.js
      ignoredRouteFiles: [".*"],
      
      // Server build configuration for Vercel compatibility
      serverModuleFormat: "cjs",
      
      // Future flags carried over from remix.config.js
      future: {
        v3_relativeSplatPath: true,
        v3_fetcherPersist: true,
        v3_lazyRouteDiscovery: true,
        v3_singleFetch: true,
        v3_throwAbortReason: true,
        v3_routeConfig: true,
      },
    }),
  ],
  
  // Path resolution for ~ alias
  resolve: {
    alias: {
      "~": path.resolve(__dirname, "app"),
    },
  },
  
  // Optimize deps and exclude Node.js specific packages
  optimizeDeps: {
    exclude: [
      "@mapbox/node-pre-gyp",
      "mock-aws-s3", 
      "aws-sdk",
      "nock"
    ],
  },
  
  // SSR configuration
  ssr: {
    noExternal: ["react-icons"],
  },
  
  // Vite configuration for better performance
  build: {
    target: "esnext",
    rollupOptions: {
      external: [
        // Node.js built-ins that shouldn't be bundled
        "fs",
        "path", 
        "crypto",
        "os",
        "util",
        // Native/binary dependencies
        "@mapbox/node-pre-gyp",
        "mock-aws-s3",
        "aws-sdk", 
        "nock",
        "bcrypt"
      ],
    },
  },
  
  // Define for client bundle
  define: {
    global: "globalThis",
  },
  
  // Server configuration for development
  server: {
    port: 5173,
  },
});