# K-pop Search Platform

A fan-centric search platform for K-pop content powered by Vectara.

## Features
- Chat-based search interface
- Multilingual support (Korean/English)
- Social media integration
- Source linking

## Dependencies

Install [npm and node](https://nodejs.org/en/download).

Install dependencies with:

```
npm install
```

## Configuration

The app requires a `configuration.ts` file in the `/src` directory with K-pop specific configuration:

```ts
import { Config } from "./contexts/ConfigurationContext";

export const configuration: Config = {
  customerId: "<your customer ID here>",
  corpusKey: "<your corpus key here>",
  apiKey: "<your API key here>",
  endpoint: "api.vectara.io",
  appTitle: "K-pop Search",
  questions: [
    "Who are the members of BTS?",
    "What are BLACKPINK's most popular songs?",
    "Tell me about NewJeans' latest comeback",
    "What K-pop concerts are happening this year?"
  ]
};
```

### Data Requirements
- Vectara corpus must contain indexed K-pop content
- Content should support both Korean and English text
- Social media content should include platform metadata
- URLs should be provided for source linking

For more information on configuration options, see the [Configuration Reference section](#configuration-reference) or the original [TS definition](./src/contexts/ConfigurationContext.tsx) for the `Config`.

## Development and Testing Strategy

### Important Notes
- Local testing is not recommended due to NUANCED TypeScript dependency conflicts
- Rely on CI checks for automated validation
- Changes are validated through GitHub PR reviews and human testing
- Vectara corpus content must be verified by reviewers

### Verification Requirements
Before merging changes:
1. CI checks must pass
2. Human review must verify:
   - Vectara corpus content accessibility
   - Multilingual support functionality
   - Social media preview rendering
   - Search result accuracy

### Running locally (Not Recommended)
Due to NUANCED dependency issues, local testing is not currently supported. Instead:
- Rely on CI checks for automated validation
- Use PR reviews for functional verification
- Request reviewer testing for specific features

## Codebase

### Front-end

The front-end is React and SCSS. It connects directly to the Vectara API to search the data in your Vectara account. You can edit the code to make requests against a proxy server instead.

### Back-end

The back-end consists of a very light-weight Express server for local development.

## Set up your data in Vectara

To set up this app to pull data from your Vectara corpus:

1. [Create a Vectara account](https://console.vectara.com/signup).
2. [Create a corpus and add data to it](https://docs.vectara.com/docs/console-ui/creating-a-corpus).
3. [Create a **QueryService** API key](https://docs.vectara.com/docs/console-ui/manage-api-access#create-an-api-key).

**Pro-tip:** After you create an API key, navigate to your corpus and click on the "Access control" tab. Find your API key on the bottom and select the "Copy all" option to copy your customer ID, corpus ID, and API key. This gives you all the data you need to configure a Create-UI app.

## Configuration Reference

```ts
type Configuration = {
  // Your Vectara customer ID.
  customerId: string;

  // The key of your Vectara corpus.
  corpusKey: string;

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
