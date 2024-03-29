/**
 * @type {import('@remix-run/dev/config').AppConfig}
 */
module.exports = {
  appDirectory: 'app',
  assetsBuildDirectory: 'public/build',
  publicPath: '/build/',
  ignoredRouteFiles: ['.*'],
  // Values for vercel build https://remix.run/docs/en/1.19.3/pages/v2#vercel
  publicPath: '/build/', // default value, can be removed
  serverBuildPath: 'api/index.js',
  serverMainFields: ['main', 'module'], // default value, can be removed
  serverMinify: false, // default value, can be removed
  serverModuleFormat: 'cjs', // default value, can be removed
  serverPlatform: 'node', // default value, can be removed
  // ----------------------------------
};
