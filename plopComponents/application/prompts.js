const DEFAULT_CONFIGS = {
  demoDocs: {
    customerId: "1366999410",
    corpusId: "1",
    apiKey: "zqt_UXrBcnI2UXINZkrv4g1tQPhzj02vfdtqYJIDiA",
    appName: "Vectara Docs",
    questions: [
      "How do I enable hybrid search?",
      "How is data encrypted?",
      "What is a textless corpus?",
      "How do I configure OAuth?"
    ]
  },

  demoDotcom: {
    customerId: "1366999410",
    corpusId: "2",
    apiKey: "zqt_UXrBcnnt4156FZqMtzK8OEoZqcR0OrecS5Bb6Q",
    appName: "Vectara.com Q&A",
    questions: ["What is grounded generation?", "How do I index a document?", "What does Vectara do?", "Who is Amr?"]
  },

  demoFeynman: {
    customerId: "1366999410",
    corpusId: "3",
    apiKey: "zqt_UXrBclYURJiAW9MiKT1L60EJC6iaIoWYj_bSJg",
    appName: "Ask Feynman",
    questions: [
      "Who figured out the motion of the planets?",
      "Is light a particle or a wave?",
      "What is a Pauli Spin matrix?",
      "What's the importance of the two slit experiment?"
    ]
  }
};

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
        },
        {
          name: "Demo: Docs          | A preconfigured demo for asking questions about Vectara's docs.",
          value: "demoDocs"
        },
        {
          name: "Demo: Science       | Another preconfigured demo, but with Richard Feynman's lectures.",
          value: "demoFeynman"
        },
        {
          name: "Demo: Vectara.com   | Another preconfigured demo, but with content from our website.",
          value: "demoDotcom"
        }
      ]
    });

    const isDemoUi = ["demoDocs", "demoFeynman", "demoDotcom"].includes(appTypeAns.appType);

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

    const appDirName = isDemoUi ? appTypeAns.appType : customAppDirNameAns.customAppDirName;

    const promptAnswers = {
      ...appTypeAns,
      ...customerIdAns,
      ...corpusIdAns,
      ...apiKeyAns,
      ...appNameAns,
      appDirName,
      questions
    };

    // Overlay default answers if app is a preset app.
    const ans = {
      ...promptAnswers,
      ...(DEFAULT_CONFIGS[appDirName] ?? {})
    };

    ans.questions = JSON.stringify(ans.questions);

    return ans;
  }
};
