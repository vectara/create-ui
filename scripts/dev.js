const fs = require("fs");
const { spawn } = require("child_process");
const chokidar = require("chokidar");
const chalk = require("chalk");
const minimist = require("minimist");

const args = minimist(process.argv.slice(2));

const templateDir = args.template;
const devDir = "dev";
const devPath = `${devDir}/${templateDir}`;

try {
  // Delete and recreate directory.
  fs.rmSync(devPath, { recursive: true, force: true });

  if (!fs.existsSync(devDir)) {
    fs.mkdirSync(devDir);
  }

  if (!fs.existsSync(devPath)) {
    fs.mkdirSync(devPath);
  }

  const templatePath = `apps/${templateDir}`;

  // Copy code
  fs.cpSync(templatePath, devPath, {
    recursive: true
  });

  // Copy .env
  fs.cpSync(`.env`, `./${devPath}/.env`);

  // Keep dev src files in sync with template src.
  var watcher = chokidar.watch(templatePath, { persistent: true, ignoreInitial: true });

  watcher
    .on("add", function (path) {
      const filePath = path.replace(templatePath, devPath);
      console.log(chalk.magenta(`Add ${filePath}`));
      fs.cpSync(path, filePath);
    })
    .on("change", function (path) {
      const filePath = path.replace(templatePath, devPath);
      console.log(chalk.magenta(`Update ${filePath}`));
      fs.copyFileSync(path, filePath);
    })
    .on("unlink", function (path) {
      const filePath = path.replace(templatePath, devPath);
      console.log(chalk.magenta(`Remove ${filePath}`));
      fs.rmSync(filePath);
    })
    .on("error", function (error) {
      console.error("Sync error", error);
    });

  // Bootstrap
  spawn(`cd ./${devPath} && npm install && npm run start`, {
    shell: true,
    stdio: "inherit"
  });
} catch (err) {
  console.error(err);
}
