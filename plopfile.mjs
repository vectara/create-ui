import { createRequire } from "module";
import path from "path";
import { fileURLToPath } from "url";
const require = createRequire(import.meta.url);
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const {
  setActions: setApplicationActions,
  getActions: getApplicationActions
} = require(`${__dirname}/plopComponents/application/actions`);

const { renderPrompts: renderApplicationPrompts } = require(`${__dirname}/plopComponents/application/prompts`);

export default function (plop) {
  setApplicationActions(plop, __dirname);

  plop.setGenerator("vectara-create", {
    description: "Configuration Variables",
    prompts: async (inquirer) => {
      await inquirer.prompt({
        type: "input",
        name: "acknowledgePrimer",
        message: "Welcome to Vectara's UI Creator!\nPress Enter to continue."
      });

      const answers = await renderApplicationPrompts(inquirer);

      return {
        category: "application",
        ...answers
      };
    },
    actions: function (data) {
      switch (data.category) {
        default:
          return getApplicationActions(data, __dirname);
      }
    }
  });
}
