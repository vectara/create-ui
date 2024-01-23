const esbuild = require("esbuild");
const chokidar = require("chokidar");
const liveServer = require("live-server");
const { sassPlugin } = require("esbuild-sass-plugin");
const cssPlugin = require("esbuild-css-modules-plugin");
const { config: devScriptBuildConfig } = require("./buildConfigs");
const { dependencies } = require("../package.json");
const entryFile = "src/index.tsx";

const sharedConfig = {
  bundle: true,
  entryPoints: [entryFile],
  logLevel: "info",
  treeShaking: true,
  minify: true,
  sourcemap: true,
  external: [...Object.keys(dependencies)],
  target: ["esnext", "node12.22.0"],
  plugins: [cssPlugin(), sassPlugin({ type: "style" })]
};

const esm = {
  ...sharedConfig,
  format: "esm",
  outfile: "./dist/index.esm.js"
};

(async () => {
  // Builder for the react-search package
  const pkgBuilder = await esbuild.context(esm);

  // Builder for the development page
  const devPageBuilder = await esbuild.context(devScriptBuildConfig);

  chokidar
    // Watch for changes to dev env code or react-search build
    .watch(["docs/*.{ts,tsx,scss}", "docs/**/*.{ts,tsx,scss}"], {
      interval: 0 // No delay
    })
    .on("all", () => {
      devPageBuilder.rebuild();
    });

  chokidar
    // Watch for changes to the react-search component
    .watch("src/**/*.{ts,tsx,scss}", {
      interval: 0 // No delay
    })
    .on("all", () => {
      pkgBuilder.rebuild();
    });

  // `liveServer` local server for hot reload.
  liveServer.start({
    open: true,
    port: +process.env.PORT || 8080,
    root: "docs/public"
  });
})();
