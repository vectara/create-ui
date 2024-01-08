const { build } = require("esbuild");
const { sassPlugin } = require("esbuild-sass-plugin");
const cssPlugin = require("esbuild-css-modules-plugin");

const sharedConfig = {
  bundle: true,
  minify: true,
  platform: "browser",
};

// plugin widget JS
// This builds the script to load the component into the
// Docusaurus page
build({
  ...sharedConfig,
  entryPoints: ["src/index.tsx"],
  outfile: "dist/index.js",
  format: "esm",
  plugins: [cssPlugin(), sassPlugin({ type: "style" })],
});
