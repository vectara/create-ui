const fs = require("fs");
const { exec } = require("child_process");

const configFiles = ["build.js", "global.d.ts", "tsconfig.json", "package.json", ".eslintignore", ".eslintrc.js"];

const appTypeToTemplateDir = {
  search: "search",
  custom: "qa",
  preset: "qa"
};

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

      const templateDir = appTypeToTemplateDir[answers.appType];
      const templatePath = `${dir}/apps/${templateDir}`;

      // Copy code
      fs.cpSync(templatePath, answers.appDirName, {
        recursive: true,
        filter: (src) => {
          // Don't copy node_modules.
          return src !== `${templatePath}/node_modules`;
        }
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
        force: true
      },
      () =>
        `App created in ./${data.appDirName}!\nTo run your app, run "cd ${data.appDirName} && npm install && npm run start"`
    ];
  }
};
