/**
 * @type {import('@remix-run/dev/config').AppConfig}
 */
module.exports = {
  appDirectory: 'app',
  assetsBuildDirectory: 'public/build',
  publicPath: '/build/',
  ignoredRouteFiles: ['.*'],
  // Values for vercel build https://remix.run/docs/en/1.19.3/pages/v2#vercel
  serverBuildPath: 'api/index.js',
  serverMainFields: ['main', 'module'], // default value, can be removed
  serverMinify: false, // default value, can be removed
  serverModuleFormat: 'cjs', // default value, can be removed
  serverPlatform: 'node', // default value, can be removed
  // Future flags for v3 preparation
  future: {
    v3_relativeSplatPath: true,
    v3_fetcherPersist: true,
    v3_lazyRouteDiscovery: true,
    v3_singleFetch: true,
    v3_throwAbortReason: true,
  },
  // ----------------------------------
};
