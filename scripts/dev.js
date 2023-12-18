const fs = require("fs");
const { execSync } = require("child_process");
var chokidar = require("chokidar");

const devDir = "dev";
const folderName = "dev/search";

try {
  // Delete and recreate directory.
  fs.rmSync(folderName, { recursive: true, force: true });

  if (!fs.existsSync(devDir)) {
    fs.mkdirSync(devDir);
  }

  if (!fs.existsSync(folderName)) {
    fs.mkdirSync(folderName);
  }

  const templateDir = "search";
  const templateRoot = `apps/${templateDir}`;

  // Copy public www/ files
  fs.cpSync(`${templateRoot}/public`, `./${folderName}/public`, {
    recursive: true
  });

  // Copy client code
  fs.cpSync(`${templateRoot}/client/src`, `./${folderName}/src`, {
    recursive: true
  });

  // Copy server code
  fs.cpSync(`${templateRoot}/server`, `./${folderName}/server`, {
    recursive: true
  });

  // Copy build configs
  const configFiles = ["build.js", "global.d.ts", "tsconfig.json", "package.json", ".eslintignore", ".eslintrc.js"];
  configFiles.forEach((filename) => {
    fs.cpSync(`${templateRoot}/buildConfigs/${filename}`, `./${folderName}/${filename}`);
  });

  // Copy .env
  fs.cpSync(`.env`, `./${folderName}/.env`);

  // Copy src when the files change.
  var watcher = chokidar.watch("apps/search", { ignored: /^\./, persistent: true });

  function updateSrc() {
    fs.rmSync(`${folderName}/src`, { recursive: true, force: true });
    fs.mkdirSync(`${folderName}/src`);
    fs.cpSync(`${templateRoot}/client/src`, `./${folderName}/src`, {
      recursive: true
    });
  }

  watcher
    .on("add", updateSrc)
    .on("change", updateSrc)
    .on("unlink", updateSrc)
    .on("error", function (error) {
      console.error("Error happened", error);
    });

  // Bootstrap
  process.chdir("./dev/search");
  execSync("npm install");
  execSync("npm run start");
} catch (err) {
  console.error(err);
}
