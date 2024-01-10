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
        { name: "Search              | A typical semantic search UI. Connect it to your own corpus.", value: "search" },
        {
          name: "Search Summary      | Like search, but preceded by a summary of the most relevant results.",
          value: "searchSummary"
        },
        {
          name: "Question and Answer | Expects the user to ask a question instead of entering search terms.",
          value: "questionAndAnswer"
        }
      ]
    });

    const appNameAns = await inquirer.prompt({
      type: "input",
      name: "appName",
      message: "What do you want to name your application? Just accept all defaults to generate a working example.",
      default: "Vectara Docs Example"
    });

    const customerIdAns = await inquirer.prompt({
      type: "input",
      name: "customerId",
      message: "What's your Vectara Customer ID?",
      default: "1366999410"
    });

    const corpusIdAns = await inquirer.prompt({
      type: "input",
      name: "corpusId",
      message: "What's the Corpus ID of the corpus that contains your data?",
      default: "1"
    });

    const apiKeyAns = await inquirer.prompt({
      type: "input",
      name: "apiKey",
      message: "What's your QueryService API Key? This must have access to the corpus.",
      default: "zqt_UXrBcnI2UXINZkrv4g1tQPhzj02vfdtqYJIDiA"
    });

    const questions = [];
    const haveQuestionsAns = await inquirer.prompt({
      type: "confirm",
      name: "value",
      message: "Do you want to suggest questions for your users to try?",
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

    const promptAnswers = {
      ...appTypeAns,
      ...customerIdAns,
      ...corpusIdAns,
      ...apiKeyAns,
      ...appNameAns,
      // Convert app name to kebab case.
      appDirName: appNameAns.appName.toLowerCase().replace(/[\s_]+/g, "-"),
      questions
    };

    promptAnswers.questions = JSON.stringify(
      promptAnswers.questions.length > 0
        ? promptAnswers.questions
        : [
            "How do I enable hybrid search?",
            "How is data encrypted?",
            "What is a textless corpus?",
            "How do I configure OAuth?"
          ]
    );

    return promptAnswers;
  }
};
