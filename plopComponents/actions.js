const fs = require("fs");
const { exec } = require("child_process");

const appTypeToTemplateDir = {
  chat: "chat",
  search: "search",
  searchSummary: "searchSummary",
  questionAndAnswer: "questionAndAnswer"
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
        path: `${process.cwd()}/{{appDirName}}/src/configuration.ts`,
        templateFile: `${dir}/plopTemplates/${data.appType === "chat" ? "chatConfiguration.hbs" : "configuration.hbs"}`,
        force: true
      },
      () =>
        `App created in ./${data.appDirName}!\nTo run your app, run "cd ${data.appDirName} && npm install && npm run start"`
    ];
  }
};
