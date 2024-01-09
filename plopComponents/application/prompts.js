const vectaraWebsiteQuestions = require(`${__dirname}/../../sampleData/vectara-website/queries.json`);
const vectaraDocsQuestions = require(`${__dirname}/../../sampleData/vectara-docs/queries.json`);
const askFeynmanQuestions = require(`${__dirname}/../../sampleData/ask-feynman/queries.json`);

const DEFAULT_CONFIGS = {
  "vectara-docs": {
    customerId: "1366999410",
    corpusId: "1",
    apiKey: "zqt_UXrBcnI2UXINZkrv4g1tQPhzj02vfdtqYJIDiA",
    appName: "Vectara Docs",
    questions: JSON.stringify(vectaraDocsQuestions.questions)
  },

  "vectara-website": {
    customerId: "1366999410",
    corpusId: "2",
    apiKey: "zqt_UXrBcnnt4156FZqMtzK8OEoZqcR0OrecS5Bb6Q",
    appName: "Vectara.com Q&A",
    questions: JSON.stringify(vectaraWebsiteQuestions.questions)
  },

  "ask-feynman": {
    customerId: "1366999410",
    corpusId: "3",
    apiKey: "zqt_UXrBclYURJiAW9MiKT1L60EJC6iaIoWYj_bSJg",
    appName: "Ask Feynman",
    questions: JSON.stringify(askFeynmanQuestions.questions)
  }
};

module.exports = {
  renderPrompts: async (inquirer) => {
    const appTypeAns = await inquirer.prompt({
      type: "list",
      name: "appType",
      message: "What type of UI would you like to create?",
      choices: [
        { name: "Search", value: "search" },
        { name: "Search Summary", value: "searchSummary" },
        { name: "Question and Answer", value: "questionAndAnswer" },
        { name: "Preconfigured demo", value: "preset" }
      ]
    });

    const isDemoUi = appTypeAns.appType === "preset";

    const presetAppDirNameAns = await inquirer.prompt({
      when: () => isDemoUi,
      type: "list",
      name: "presetAppDirName",
      message: "Choose a pre-built sample UI.",
      choices: [
        {
          name: "Vectara Docs - Answer questions about Vectara's platform documentation",
          value: "vectara-docs"
        },
        {
          name: "Vectara.com Q&A - Answer questions about Vectara's company website",
          value: "vectara-website"
        },
        {
          name: "Ask Feynman - Answer questions about Richard Feynman's lectures",
          value: "ask-feynman"
        }
      ]
    });

    const customAppDirNameAns = await inquirer.prompt({
      when: () => !isDemoUi,
      type: "input",
      name: "customAppDirName",
      message: "What directory name would you like to use?"
    });

    const appNameAns = await inquirer.prompt({
      when: () => !isDemoUi,
      type: "input",
      name: "appName",
      message: "What would you like to name your application?"
    });

    const customerIdAns = await inquirer.prompt({
      when: () => !isDemoUi,
      type: "input",
      name: "customerId",
      message: "What's your Vectara Customer ID?"
    });

    const corpusIdAns = await inquirer.prompt({
      when: () => !isDemoUi,
      type: "input",
      name: "corpusId",
      message: "What Vectara Corpus ID is associated with your data?"
    });

    const apiKeyAns = await inquirer.prompt({
      when: () => !isDemoUi,
      type: "input",
      name: "apiKey",
      message: "What is your Vectara QueryService API Key (This can be safely shared)?"
    });

    const questions = [];
    const haveQuestionsAns = await inquirer.prompt({
      when: () => !isDemoUi,
      type: "confirm",
      name: "value",
      message: "Would you like to add sample questions for your users?"
    });

    if (haveQuestionsAns.value) {
      let moreQuestionsAns;
      let numQuestions = 0;
      do {
        numQuestions++;

        let questionAns = await inquirer.prompt({
          type: "input",
          name: "value",
          message: `Enter sample question ${numQuestions}:`
        });

        questions.push(questionAns.value);

        moreQuestionsAns = await inquirer.prompt({
          type: "confirm",
          name: "value",
          message: "Would you like to add more questions?"
        });
      } while (moreQuestionsAns.value);
    }

    const appDirName = presetAppDirNameAns.presetAppDirName ?? customAppDirNameAns.customAppDirName;

    const promptAnswers = {
      ...appTypeAns,
      ...customerIdAns,
      ...corpusIdAns,
      ...apiKeyAns,
      ...appNameAns,
      appDirName,
      questions: JSON.stringify(questions)
    };

    // Overlay default answers if app is a preset app.
    const ans = {
      ...promptAnswers,
      ...(DEFAULT_CONFIGS[appDirName] ?? {})
    };

    return ans;
  }
};
