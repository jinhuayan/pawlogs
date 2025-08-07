// metro.config.js
const { getDefaultConfig } = require('expo/metro-config');

module.exports = (() => {
  const config = getDefaultConfig(__dirname);

  // Add platform‐specific JS extensions to the resolver
  config.resolver.sourceExts = [
    ...config.resolver.sourceExts,
    'ios.js',
    'android.js',
    'native.js',
    'cjs',
  ];

  return config;
})();