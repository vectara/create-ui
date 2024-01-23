# Vectara sample code for a Summarized Semantic Search UI

This app provides working sample code for implementing a Summarized Semantic Search UI that's powered by [Vectara](https://vectara.com/). It was generated using the [Create-UI code-generator](https://github.com/vectara/create-ui).

The Summarized Semantic UI is characterized by:

- A search box for entering a natural-language query. This can take the form of a question or just search terms.
- A list of search results.
- A summary of search results that are most relevant to the query, with citations.

A user will typically scan the summary for points of interest, which is faster than reviewing the list of search results. If an aspect of the summary catches their eye, they'll dig deeper into the cited search result. They'll repeat this pattern until they've reviewed all of the interesting information that was relevant to their query.

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
  customerId: "<your customer ID here>",
  corpusId: "<your corpus ID here>",
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

For more information on configuration options, see the [Configuration Reference section](#configuration-reference) or the original [TS definition](./src/contexts/ConfigurationContext.tsx) for the `Config`.

## Running locally

Run the code locally and serve it at `http://localhost:4444/` with:

```
npm run start
```

If you make changes to the source code, the app will automatically reload with your changes.

## Codebase

### Front-end

The front-end is React and SCSS. It connects directly to the Vectara API to search the data in your Vectara account. You can edit the code to make requests against a proxy server instead.

### Back-end

The back-end consists of a very light-weight Express server for local development.

## Set up your data in Vectara

To set up this app to pull data from your Vectara corpus:

1. [Create a free Vectara account](https://console.vectara.com/signup).
2. [Create a corpus and add data to it](https://docs.vectara.com/docs/console-ui/creating-a-corpus).
3. [Create a **QueryService** API key](https://docs.vectara.com/docs/console-ui/manage-api-access#create-an-api-key).

**Pro-tip:** After you create an API key, navigate to your corpus and click on the "Access control" tab. Find your API key on the bottom and select the "Copy all" option to copy your customer ID, corpus ID, and API key. This gives you all the data you need to configure a Create-UI app.

### How to use metadata

Vectara enables you to define [metadata](https://docs.vectara.com/docs/learn/document-data-structuring#metadata) on your documents. This app behaves differently based on the presence of specific metadata fields:

- `title`: If this field is defined it will be rendered as the title of a search result. Typically this is something like the title of the document or webpage.
- `url`: If this field is defined, the UI will render the search result as a link to the defined URL.

## Configuration Reference

```ts
type Configuration = {
  // Your Vectara customer ID.
  customerId: string;

  // The ID of your Vectara corpus.
  corpusId: string;

  // A Query API key with access to your corpus.
  apiKey: string;

  // The host of your API URL. Defaults to "api.vectara.io".
  endpoint: string;

  // Sample questions to show in the UI.
  questions?: string[];

  // The title of your application shown in the UI.
  appTitle?: string;
};
```
