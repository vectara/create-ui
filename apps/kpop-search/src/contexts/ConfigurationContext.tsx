import { createContext, useContext, ReactNode } from "react";
import { mmrRerankerId } from "../view/types";
import { configuration } from "../configuration";

export interface CorpusConfig {
  corpusKey: string;
  customerId: string;
  apiKey: string;
}

export interface Config {
  // Search
  endpoint: string;
  corpora: CorpusConfig[];

  // App
  appTitle?: string;

  // Questions
  questions?: string[];
}

type Search = {
  endpoint?: string;
  corpora?: CorpusConfig[];
};

type App = {
  title: string;
};

type ExampleQuestions = string[];
type Rerank = {
  isEnabled: boolean;
  numResults?: number;
  id?: number;
  diversityBias?: number;
};
type Hybrid = { numWords: number; lambdaLong: number; lambdaShort: number };

interface ConfigContextType {
  search: Search;
  app: App;
  rerank: Rerank;
  hybrid: Hybrid;
  exampleQuestions: ExampleQuestions;
}

const ConfigContext = createContext<ConfigContextType | undefined>(undefined);

type Props = {
  children: ReactNode;
};

const SEARCH_CONFIGS = {
  endpoint: configuration.endpoint,
  corpora: configuration.corpora
};

const APP_CONFIGS = {
  title: configuration.appTitle ?? ""
};

export const ConfigContextProvider = ({ children }: Props) => {
  const exampleQuestions = configuration.questions ?? [];
  const rerankConfig = {
    isEnabled: true,
    numResults: 50,
    id: mmrRerankerId,
    diversityBias: 0.3
  };

  const hybrid = {
    numWords: 2,
    lambdaLong: 0.0,
    lambdaShort: 0.1
  };

  return (
    <ConfigContext.Provider
      value={{
        search: SEARCH_CONFIGS,
        app: APP_CONFIGS,
        rerank: rerankConfig,
        hybrid,
        exampleQuestions
      }}
    >
      {children}
    </ConfigContext.Provider>
  );
};

export const useConfigContext = () => {
  const context = useContext(ConfigContext);
  if (context === undefined) {
    throw new Error("useConfigContext must be used within a ConfigContextProvider");
  }
  return context;
};
