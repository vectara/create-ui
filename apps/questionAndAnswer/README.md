# Vectara sample code for a Question and Answer UI

This app provides working sample code for implementing a Question and Answer UI that's powered by [Vectara](https://vectara.com/). It was generated using the [Create UI code-generator](https://github.com/vectara/create-ui).

The Question and Answer UI is characterized by:

- A search box for entering a natural-language query. This typically takes the form of a question.
- A condensed answer based upon the most relevant search results, with citations.

A user will typically scan the answer to see if it truly answers their question. They'll use the citations to verify that the answer is grounded in facts. If the answer doesn't fully answer their question they'll try again with a differently-worded question.

## Dependencies

Install [npm and node](https://nodejs.org/en/download).

Install dependencies with:

```
npm install
```

## Configuration

The app expects to find a `configuration.ts` file in the `/src` directory with this minimal configuration:

```ts
import { Config } from "./contexts/ConfigurationContext";

export const configuration: Config = {
  corpusId: "<your corpus ID here>",
  customerId: "<your customer ID here>",
  apiKey: "<your API key here>",
  endpoint: "api.vectara.io"
};
```

You can configure sample questions like this:

```ts
export const configuration: Config = {
  // ... other configs here
  questions: [
    "How do I enable hybrid search?",
    "How is data encrypted?",
    "What is a textless corpus?",
    "How do I configure OAuth?"
  ]
};
```

The TS definition for the `Config` type can be found [in this file](https://github.com/vectara/create-ui/blob/main/apps/qa/src/contexts/ConfigurationContext.tsx).

For more information on configuration options, please see [this section](#configuration-reference).

## Running locally

Run the code locally and serve it at `http://localhost:4444/` with:

```
npm run start
```

If you make changes to the source code, the app will automatically reload with your changes.

NOTE: The UI assumes there is a metadata field called `url` for each document in your Vectara corpus. If the `url` field exists, it will be displayed with search results as a clickable URL. If it does not, the title is used instead, but it will not be clickable.

## Configuration Reference

```ts
type Configuration = {
  // The ID of your Vectara data store
  corpusId: string;

  // Your Vectara customer ID
  customerId: string;

  // The query API key of your Vectara data store
  apiKey: string;

  // The host of your API URL, default is "api.vectara.io"
  endpoint: string;

  // The header of your Q & A page
  searchTitle?: string;

  // Sample questions to show in the UI
  questions?: string[];

  // Whether or not to enable re-ranking, which only works in English for now.
  // For more info, see: https://docs.vectara.com/docs/api-reference/search-apis/reranking
  rerank?: boolean;

  // The number of results to use for re-ranking.
  rerankNumResults?: number;

  // The title of your application, to be shown in the UI.
  appTitle?: string;

  // App header presentation details - link, logo, alt description, and logo height.
  appHeaderLogoLink?: string;
  appHeaderLogoSrc?: string;
  appHeaderLogoAlt?: string;
  appHeaderLogoHeight?: string;

  // Presentation configuration for an option "Learn More" link to be shown at the top of the UI.
  appHeaderLearnMoreLink?: string;
  appHeaderLearnMoreText?: string;

  // Filters
  enableSourceFilters?: boolean;
  allSources?: boolean;
  sources?: string[];

  // Form presentation details - input box title, logo, description, and placeholder
  searchTitle?: string;
  searchLogoLink?: string;
  searchLogoSrc?: string;
  searchLogoAlt?: string;
  searchLogoHeight?: string;
  searchDescription?: string;
  searchPlaceholder?: string;

  // Summary
  summaryDefaultLanguage?: string;
  summaryNumResults?: number;
  summaryNumSentences?: number;
  summaryPromptName?: string;
  summaryEnableHem?: boolean;

  // The number of words that will trigger a hybrid search.
  // A hybrid search will include keyword searches.
  hybridSearchNumWords?: number;

  // Lambda values for long and short input values.
  // For more info, see: https://docs.vectara.com/docs/api-recipes
  hybridSearchLambdaLong?: number;
  hybridSearchLambdaShort?: number;

  // Whether to use Vectara's MMR (maximum marginal relevance) functionality.
  // For more info, see: https://docs.vectara.com/docs/api-reference/search-apis/reranking
  mmr?: boolean;

  // The number of results to use for reranking
  mmrNumResults?: number;

  // The diversity bias factor (0..1) for MMR reranker.
  // The higher the value, the more MMR is preferred over relevance.
  mmrDiversityBias?: number;

  hfToken?: string;
};
```
