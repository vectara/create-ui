const fs = require("fs");
const { spawn } = require("child_process");
const chokidar = require("chokidar");
const chalk = require("chalk");

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
  const clientSrcDir = `${templateRoot}/client/src`;
  fs.cpSync(clientSrcDir, `./${folderName}/src`, {
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

  // Keep dev src files in sync with template src.
  var watcher = chokidar.watch(clientSrcDir, { persistent: true, ignoreInitial: true });

  watcher
    .on("add", function (path) {
      const devPath = path.replace(clientSrcDir, `${folderName}/src`);
      console.log(chalk.magenta(`Add ${devPath}`));
      fs.cpSync(path, devPath);
    })
    .on("change", function (path) {
      const devPath = path.replace(clientSrcDir, `${folderName}/src`);
      console.log(chalk.magenta(`Update ${devPath}`));
      fs.copyFileSync(path, devPath);
    })
    .on("unlink", function (path) {
      const devPath = path.replace(clientSrcDir, `${folderName}/src`);
      console.log(chalk.magenta(`Remove ${devPath}`));
      fs.rmSync(devPath);
    })
    .on("error", function (error) {
      console.error("Sync error", error);
    });

  // Bootstrap
  const child = spawn("cd ./dev/search && npm install && npm run start", {
    shell: true,
    stdio: "inherit"
  });
} catch (err) {
  console.error(err);
}
