# Vectara sample code for a Semantic Search UI

This app provides working sample code for implementing a Semantic Search UI that's powered by [Vectara](https://vectara.com/). It was generated using the [Create-UI code-generator](https://github.com/vectara/create-ui).

The Semantic Search UI is characterized by:

- A search box for entering a natural-language query. This can take the form of a question or just search terms.
- A list of search results.

A user will typically scan the list for relevant results and dig deeper into any results that look interesting. They'll try variations on the same basic query to make sure they find as many potentially useful results as possible.

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
