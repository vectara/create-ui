module.exports = {
  renderPrompts: async (inquirer) => {
    const appTypeAns = await inquirer.prompt({
      type: "list",
      name: "appType",
      message: `
╭―――――――――――――――――――――――――――╮
│                           │
│     Vectara Sample UI     │
│                           │
╰―――――――――――――――――――――――――――╯

Create a sample UI codebase powered by the Vectara Platform.
Which type of codebase would you like to create?\n`,
      choices: [
        { name: "Search              | A typical semantic search UI.", value: "search" },
        {
          name: "Search Summary      | A semantic search UI preceded by a summary of the most relevant results.",
          value: "searchSummary"
        },
        {
          name: "Question and Answer | Expects the user to ask a question and provides them a concise answer.",
          value: "questionAndAnswer"
        }
      ]
    });

    const dataSourceAns = await inquirer.prompt({
      type: "list",
      name: "dataSource",
      message:
        "Want to connect to your own data or use our sample data? Sample data consists of pages scraped from docs.vectara.com.",
      choices: [
        { name: "Use my own data", value: "customData" },
        {
          name: "Use the Vectara Docs sample data",
          value: "sampleData"
        }
      ]
    });

    const isCustomData = dataSourceAns.dataSource === "customData";

    const appNameAns = await inquirer.prompt({
      when: () => isCustomData,
      type: "input",
      name: "appName",
      message: "What do you want to name your application?"
    });

    const customerIdAns = await inquirer.prompt({
      when: () => isCustomData,
      type: "input",
      name: "customerId",
      message: "What's your Vectara Customer ID?"
    });

    const corpusIdAns = await inquirer.prompt({
      when: () => isCustomData,
      type: "input",
      name: "corpusId",
      message: "What's the Corpus ID of the corpus that contains your data?"
    });

    const apiKeyAns = await inquirer.prompt({
      when: () => isCustomData,
      type: "input",
      name: "apiKey",
      message: "What's your QueryService API Key? This must have access to the corpus."
    });

    const questions = [];
    const haveQuestionsAns = await inquirer.prompt({
      when: () => isCustomData,
      type: "confirm",
      name: "value",
      message: "Do you want the UI to suggest questions for people to try?",
      default: false
    });

    if (haveQuestionsAns.value) {
      let moreQuestionsAns;
      let numQuestions = 0;
      do {
        numQuestions++;

        let questionAns = await inquirer.prompt({
          type: "input",
          name: "value",
          message: `Enter suggested question ${numQuestions}:`
        });

        questions.push(questionAns.value);

        moreQuestionsAns = await inquirer.prompt({
          type: "confirm",
          name: "value",
          message: "Want to suggest another question?"
        });
      } while (moreQuestionsAns.value);
    }

    return isCustomData
      ? {
          appType: appTypeAns.appType,
          appName: appNameAns.appName,
          appDirName: appNameAns.appName.toLowerCase().replace(/[\s_]+/g, "-"),
          customerId: customerIdAns.customerId,
          corpusId: corpusIdAns.corpusId,
          apiKey: apiKeyAns.apiKey,
          questions: JSON.stringify(questions)
        }
      : {
          appType: appTypeAns.appType,
          appName: "Vectara Docs Example",
          appDirName: "vectara-docs-example",
          customerId: "1366999410",
          corpusId: "1",
          apiKey: "zqt_UXrBcnI2UXINZkrv4g1tQPhzj02vfdtqYJIDiA",
          questions: JSON.stringify([
            "How do I enable hybrid search?",
            "How is data encrypted?",
            "What is a textless corpus?",
            "How do I configure OAuth?"
          ])
        };
  }
};
