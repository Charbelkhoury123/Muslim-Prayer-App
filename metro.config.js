const { getDefaultConfig } = require('expo/metro-config');

const config = getDefaultConfig(__dirname);

// Force Metro to resolve CommonJS (.js) files over ESM (.mjs) for packages
// that use import.meta (which Metro's Hermes transform doesn't support on web)
config.resolver.unstable_enablePackageExports = false;

module.exports = config;
