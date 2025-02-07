import { Config } from "./contexts/ConfigurationContext";

export const configuration: Config = {
  endpoint: "api.vectara.io",
  corpora: [{
    corpusKey: "5",
    customerId: "2213776567",
    apiKey: "zwt_g_OMt8XL9zt7g7lNo5D1Grvff9Llg9kL8127"
  }],
  appTitle: "K-pop Search",
  questions: [
    "Who are the members of BTS?",
    "What are BLACKPINK's most popular songs?",
    "Tell me about NewJeans' latest comeback",
    "What K-pop concerts are happening this year?"
  ]
};
