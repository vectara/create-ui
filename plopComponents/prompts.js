const APP_TYPE_TO_LABEL = {
  chat: "Chat",
  search: "Search",
  searchSummary: "Search Summary",
  questionAndAnswer: "Question and Answer"
};

const toKebabCase = (str) => str.toLowerCase().replace(/[\s_]+/g, "-");

const generativeAppTypes = ["chat", "searchSummary", "questionAndAnswer"];

module.exports = {
  renderPrompts: async (inquirer) => {
    const appTypeAnswer = await inquirer.prompt({
      type: "list",
      name: "appType",
      message: `
╭―――――――――――――――――――――――――――╮
│                           │
│     Vectara Create-UI     │
│                           │
╰―――――――――――――――――――――――――――╯

Create a sample UI codebase powered by the Vectara Platform.
Which type of codebase would you like to create?\n`,
      choices: [
        { name: "Chat                       -> A typical chat UI.", value: "chat" },
        { name: "Semantic Search            -> A typical semantic search UI.", value: "search" },
        {
          name: "Summarized Semantic Search -> A semantic search UI preceded by a summary of the most relevant results.",
          value: "searchSummary"
        },
        {
          name: "Question and Answer        -> Expects the user to ask a question and provides them a concise answer.",
          value: "questionAndAnswer"
        }
      ]
    });

    const dataSourceAnswer = await inquirer.prompt({
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

    let fcsAnswer;
    if (generativeAppTypes.includes(appTypeAnswer.appType)) {
      fcsAnswer = await inquirer.prompt({
        type: "confirm",
        name: "value",
        message:
          "Do you want to show users a Factual Consistency Score to indicate the level of hallucination in the answers to their questions?",
        default: false
      });
    }

    const isCustomData = dataSourceAns.dataSource === "customData";

    const appNameAnswer = await inquirer.prompt({
      when: () => isCustomData,
      type: "input",
      name: "appName",
      message: "What do you want to name your application?"
    });

    const customerIdAnswer = await inquirer.prompt({
      when: () => isCustomData,
      type: "input",
      name: "customerId",
      message: "What's your Vectara Customer ID?"
    });

    const corpusKeyAnswer = await inquirer.prompt({
      when: () => isCustomData,
      type: "input",
      name: "corpusKey",
      message: "What's the Corpus Key of the corpus that contains your data?"
    });

    const apiKeyAnswer = await inquirer.prompt({
      when: () => isCustomData,
      type: "input",
      name: "apiKey",
      message:
        "What's your API Key? This must have access to the corpus. We suggest limiting its privileges to the QueryService."
    });

    const questions = [];
    const haveQuestionsAnswer = await inquirer.prompt({
      when: () => isCustomData,
      type: "confirm",
      name: "value",
      message: "The UI can suggest that users try various sample questions. Do you want to define some?",
      default: false
    });

    if (haveQuestionsAnswer.value) {
      let moreQuestionsAnswer;
      let numQuestions = 0;

      do {
        numQuestions++;

        let questionAnswer = await inquirer.prompt({
          type: "input",
          name: "value",
          message: `Enter suggested question ${numQuestions}:`
        });

        questions.push(questionAnswer.value);

        moreQuestionsAns = await inquirer.prompt({
          type: "confirm",
          name: "value",
          message: "Want to suggest another question?"
        });
      } while (moreQuestionsAnswer.value);
    }

    return isCustomData
      ? {
          appType: appTypeAnswer.appType,
          appName: appNameAnswer.appName,
          appDirName: toKebabCase(appNameAnswer.appName),
          customerId: customerIdAnswer.customerId,
          corpusKey: corpusKeyAnswer.corpusKey,
          apiKey: apiKeyAnswer.apiKey,
          fcs: fcsAnswer?.value ?? false,
          questions: JSON.stringify(questions)
        }
      : {
          appType: appTypeAnswer.appType,
          appName: "Vectara Docs Example",
          appDirName: toKebabCase(`vectara-docs-${APP_TYPE_TO_LABEL[appTypeAnswer.appType]}-example`),
          customerId: "1366999410",
          corpusKey: "vectara-docs_1",
          apiKey: "zqt_UXrBcnI2UXINZkrv4g1tQPhzj02vfdtqYJIDiA",
          fcs: true,
          questions: JSON.stringify([
            "How do I enable hybrid search?",
            "How is data encrypted?",
            "What is a textless corpus?",
            "How do I configure OAuth?"
          ])
        };
  }
};
