const path = require("path");
const { getDefaultConfig } = require("expo/metro-config");
const { withNativeWind } = require("nativewind/metro");

const config = getDefaultConfig(__dirname);

// SVG support
const { transformer, resolver } = config;
config.transformer = {
  ...transformer,
  babelTransformerPath: require.resolve("react-native-svg-transformer"),
};
config.resolver = {
  ...resolver,
  assetExts: [...resolver.assetExts.filter((ext) => ext !== "svg"), "onnx"],
  sourceExts: [...resolver.sourceExts, "svg"],
  extraNodeModules: {
    // Replace with a safe stub in Expo Go — the real package calls NativeModules.Onnxruntime.install()
    // which crashes because the JSI native module isn't compiled into Expo Go.
    "onnxruntime-react-native": path.resolve(__dirname, "mocks/onnxruntime-react-native.js"),
  },
};

module.exports = withNativeWind(config, { input: "./global.css" });
