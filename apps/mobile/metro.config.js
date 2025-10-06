const { getDefaultConfig } = require("expo/metro-config");
const path = require("path");

const config = getDefaultConfig(__dirname);

// Pastas do monorepo que o Metro deve observar
config.watchFolders = [
  path.resolve(__dirname, "../../packages/ui"),
  path.resolve(__dirname, "../../packages/utils"),
];

// Mapear imports dos packages para o bundler
config.resolver.extraNodeModules = {
  "@repo/ui": path.resolve(__dirname, "../../packages/ui/src"),
  "@repo/utils": path.resolve(__dirname, "../../packages/utils/src"),
};

module.exports = config;
