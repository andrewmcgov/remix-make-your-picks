import {reactRouter} from '@react-router/dev/vite';
import {defineConfig} from 'vite';
import path from 'path';

export default defineConfig({
  plugins: [reactRouter()],

  // Path resolution for ~ alias
  resolve: {
    alias: {
      '~': path.resolve(__dirname, 'app'),
    },
  },

  // Optimize deps and exclude Node.js specific packages
  optimizeDeps: {
    exclude: ['@mapbox/node-pre-gyp', 'mock-aws-s3', 'aws-sdk', 'nock'],
  },

  // SSR configuration
  ssr: {
    noExternal: ['react-icons'],
  },

  // Vite configuration for better performance
  build: {
    target: 'esnext',
    rollupOptions: {
      external: [
        // Node.js built-ins that shouldn't be bundled
        'fs',
        'path',
        'crypto',
        'os',
        'util',
        // Native/binary dependencies
        '@mapbox/node-pre-gyp',
        'mock-aws-s3',
        'aws-sdk',
        'nock',
        'bcrypt',
      ],
    },
  },

  // Define for client bundle
  define: {
    global: 'globalThis',
  },

  // Server configuration for development
  server: {
    port: 5173,
  },
});
