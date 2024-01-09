import { createContext, useContext, ReactNode } from "react";

import { SummaryLanguage, SUMMARY_LANGUAGES, standardRerankerId, mmrRerankerId } from "../view/types";

import { configuration } from "../configuration";

export interface Config {
  // Search
  endpoint: string;
  corpusId: string;
  customerId: string;
  apiKey: string;

  hfToken?: string;

  // App
  appTitle?: string;

  // App header
  appHeaderLogoLink?: string;
  appHeaderLogoSrc?: string;
  appHeaderLogoAlt?: string;
  appHeaderLogoHeight?: string;
  appHeaderLearnMoreLink?: string;
  appHeaderLearnMoreText?: string;

  // Filters
  enableSourceFilters?: boolean;
  allSources?: boolean;
  sources?: string[];

  // Search header
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

  // hybrid search
  hybridSearchNumWords?: number;
  hybridSearchLambdaLong?: number;
  hybridSearchLambdaShort?: number;

  // rerank
  rerank?: boolean;
  rerankNumResults?: number;

  // MMR
  mmr?: boolean;
  mmrNumResults?: number;
  mmrDiversityBias?: number;

  // questions
  questions?: string[];
}

type Search = {
  endpoint?: string;
  corpusId?: string;
  customerId?: string;
  apiKey?: string;
};

type App = {
  title: string;
};

type AppHeader = {
  logo: {
    link?: string;
    src?: string;
    alt?: string;
    height?: string;
  };
  learnMore: {
    link?: string;
    text?: string;
  };
};

type Source = { value: string; label: string };
type Filters = {
  isEnabled: boolean;
  sources: Source[];
  allSources: boolean;
  sourceValueToLabelMap?: Record<string, string>;
};

type Summary = {
  defaultLanguage: string;
  summaryNumResults: number;
  summaryNumSentences: number;
  summaryPromptName: string;
  hfToken: string;
  summaryEnableHem: boolean;
};

type SearchHeader = {
  logo: {
    link?: string;
    src?: string;
    alt?: string;
    height?: string;
  };
  title?: string;
  description?: string;
  placeholder?: string;
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
  appHeader: AppHeader;
  filters: Filters;
  summary: Summary;
  rerank: Rerank;
  hybrid: Hybrid;
  searchHeader: SearchHeader;
  exampleQuestions: ExampleQuestions;
}

const ConfigContext = createContext<ConfigContextType | undefined>(undefined);

type Props = {
  children: ReactNode;
};

const validateLanguage = (lang: string, defaultLanguage: SummaryLanguage): SummaryLanguage => {
  if ((SUMMARY_LANGUAGES as readonly string[]).includes(lang)) {
    return lang as SummaryLanguage;
  }
  return defaultLanguage;
};

const {
  searchTitle,

  // Search
  hfToken = "",

  // Filters
  enableSourceFilters = false,
  allSources = true,
  sources = [],

  // Search header
  searchLogoLink,
  searchLogoSrc,
  searchLogoAlt,
  searchLogoHeight,

  searchDescription,
  searchPlaceholder,

  // rerank
  rerank = false,
  rerankNumResults,

  // MMR
  mmr = false,
  mmrDiversityBias,
  mmrNumResults,

  // hybrid search
  hybridSearchNumWords = 2,
  hybridSearchLambdaLong = 0.0,
  hybridSearchLambdaShort = 0.1,

  // Summary
  summaryDefaultLanguage,
  summaryNumResults = 7,
  summaryNumSentences = 3,
  summaryPromptName = "vectara-summary-ext-v1.2.0",
  summaryEnableHem = false
} = configuration;

const SEARCH_CONFIGS = {
  endpoint: configuration.endpoint,
  corpusId: configuration.corpusId,
  customerId: configuration.customerId,
  apiKey: configuration.apiKey
};

const APP_CONFIGS = {
  title: configuration.appTitle ?? ""
};

const APP_HEADER_CONFIGS = {
  logo: {
    link: configuration.appHeaderLogoLink,
    src: configuration.appHeaderLogoSrc,
    alt: configuration.appHeaderLogoAlt,
    height: configuration.appHeaderLogoHeight
  },
  learnMore: {
    link: configuration.appHeaderLearnMoreLink,
    text: configuration.appHeaderLearnMoreText
  }
};

export const ConfigContextProvider = ({ children }: Props) => {
  const exampleQuestions = configuration.questions ?? [];
  const rerankConfig = {
    isEnabled: mmr || rerank,
    numResults: mmr ? mmrNumResults : rerankNumResults ?? 50,
    id: mmr ? mmrRerankerId : standardRerankerId,
    diversityBias: mmrDiversityBias ?? 0.3
  };

  const summary = {
    defaultLanguage: validateLanguage(summaryDefaultLanguage as SummaryLanguage, "auto"),
    summaryNumResults,
    summaryNumSentences,
    summaryPromptName,
    hfToken,
    summaryEnableHem: summaryEnableHem
  };

  const isFilteringEnabled = enableSourceFilters;
  const normalizedSources =
    sources.map((source) => ({
      value: source.toLowerCase(),
      label: source
    })) ?? [];

  const sourceValueToLabelMap = normalizedSources.length
    ? normalizedSources.reduce((accum, { label, value }) => {
        accum[value] = label;
        return accum;
      }, {} as Record<string, string>)
    : undefined;

  if (isFilteringEnabled && sources.length === 0) {
    console.error(
      'enableSourceFilters is set to true but sources is empty. Define some sources for filtering or set enable_source_filters to "False"'
    );
  }

  const filters = {
    isEnabled: isFilteringEnabled,
    allSources,
    sources: normalizedSources,
    sourceValueToLabelMap: sourceValueToLabelMap
  };

  const searchHeader = {
    logo: {
      link: searchLogoLink,
      src: searchLogoSrc,
      alt: searchLogoAlt,
      height: searchLogoHeight
    },
    title: searchTitle,
    description: searchDescription,
    placeholder: searchPlaceholder
  };

  const hybrid = {
    numWords: hybridSearchNumWords ?? 1,
    lambdaLong: hybridSearchLambdaLong,
    lambdaShort: hybridSearchLambdaShort
  };

  return (
    <ConfigContext.Provider
      value={{
        search: SEARCH_CONFIGS,
        app: APP_CONFIGS,
        appHeader: APP_HEADER_CONFIGS,
        filters,
        summary,
        rerank: rerankConfig,
        hybrid,
        searchHeader,
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
