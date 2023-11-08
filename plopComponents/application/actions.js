const fs = require("fs");
const { exec } = require("child_process");

const configFiles = [
  "build.js",
  "global.d.ts",
  "tsconfig.json",
  "package.json",
  ".eslintignore",
  ".eslintrc.js",
];

let appName;

module.exports = {
  setActions: (plop, dir) => {
    // Create app folder
    plop.setActionType("Create app folder", async (answers) => {
      await exec(`mkdir -m 777 ${answers.appDirName}`);
    });

    plop.setActionType("Copy files", (answers) => {
      // Cache app name for confirmation message.
      appName = answers.appName;

      // Copy public www/ files
      fs.cpSync(`${dir}/apps/qa/public`, `./${answers.appDirName}/public`, {
        recursive: true,
      });

      // Copy client code
      fs.cpSync(`${dir}/apps/qa/client/src`, `./${answers.appDirName}/src`, {
        recursive: true,
      });

      // Copy server code
      fs.cpSync(`${dir}/apps/qa/server`, `./${answers.appDirName}/server`, {
        recursive: true,
      });

      // Copy build configs
      configFiles.forEach((filename) => {
        fs.cpSync(
          `${dir}/apps/qa/buildConfigs/${filename}`,
          `./${answers.appDirName}/${filename}`
        );
      });
    });
  },

  getActions: (data, dir) => {
    return [
      { type: "Create app folder" },
      { type: "Copy files" },
      {
        type: "add",
        path: `${process.cwd()}/{{appDirName}}/.env`,
        templateFile: `${dir}/plopTemplates/env.hbs`,
        force: true,
      },
      () =>
        `App created in ./${data.appDirName}!\nTo run your app, run "cd ${data.appDirName} && npm install && npm run start"`,
    ];
  },
};
