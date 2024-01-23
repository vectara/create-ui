const { spawn } = require("child_process");

const buildDemo = (appDirectoryName, configurationFileName) => {
  // Build the demo app.
  const buildCommand = `cd apps/${appDirectoryName} && cp ../../sampleConfigurations/${configurationFileName}.ts ./src/configuration.ts && npm install && npm run build`;

  // Move and static directory to the docs directory. Rename it so it's unique.
  const staticDirPath = `../../docs/public/${appDirectoryName}Static/`;
  const moveDemoStaticFilesToDocsCommand = `rm -rf ${staticDirPath} && mv build/static/ ${staticDirPath}`;

  // Move and rename the index.html file to the docs directory.
  const moveDemoIndexHtmlToDocsCommand = `mv build/index.html ../../docs/public/${appDirectoryName}Demo.html`;

  // Fix the index.html file's /static links to point to the demo's unique static directory.
  const demoIndexPath = `../../docs/public/${appDirectoryName}Demo.html`;
  const rewriteDemoCommand = `node ../../docs/rewriteDemo.js --appDirectoryName=${appDirectoryName} --demoIndexPath=${demoIndexPath}`;

  return spawn(
    `${buildCommand} && ${moveDemoStaticFilesToDocsCommand} && ${moveDemoIndexHtmlToDocsCommand} && ${rewriteDemoCommand}`,
    {
      shell: true,
      stdio: "inherit"
    }
  );
};

(async () => {
  try {
    buildDemo("questionAndAnswer", "questionAndAnswer-configuration");
    buildDemo("search", "search-configuration");
    buildDemo("searchSummary", "searchSummary-configuration");
  } catch (err) {
    console.error(err);
  }
})();
