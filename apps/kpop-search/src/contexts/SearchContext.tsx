/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { createContext, useContext, ReactNode, useState, useEffect, useRef } from "react";
import { SummaryLanguage, SearchError, SearchResultWithSnippet, mmrRerankerId, SearchResult } from "../view/types";
import { useConfigContext } from "./ConfigurationContext";
import { HistoryItem, addHistoryItem, deleteHistory, retrieveHistory } from "./history";
import { ApiV2, streamQueryV2 } from "@vectara/stream-query-client";
import { END_TAG, START_TAG, parseSnippet } from "../utils/parseSnippet";

export const SUMMARY_NUM_RESULTS = 7;

interface SearchContextType {
  filterValue: string;
  setFilterValue: (source: string) => void;
  searchValue: string;
  setSearchValue: (value: string) => void;
  onSearch: ({
    value,
    filter,
    language,
    isPersistable
  }: {
    value?: string;
    filter?: string;
    language?: SummaryLanguage;
    isPersistable?: boolean;
  }) => void;
  reset: () => void;
  isSearching: boolean;
  searchError: SearchError | undefined;
  searchResults: SearchResultWithSnippet[] | undefined;
  searchTime: number;
  isSummarizing: boolean;
  summarizationError: SearchError | undefined;
  summarizationResponse: string | undefined;
  summarizationQuestion: string;
  summaryTime: number;
  language: SummaryLanguage;
  summaryNumResults: number;
  summaryNumSentences: number;
  summaryPromptName: string;
  history: HistoryItem[];
  clearHistory: () => void;
  searchResultsRef: React.MutableRefObject<HTMLElement[] | null[]>;
  selectedSearchResultPosition: number | undefined;
  selectSearchResultAt: (position: number) => void;
  onRetry: () => void;
}

const SearchContext = createContext<SearchContextType | undefined>(undefined);

type Props = {
  children: ReactNode;
};

export const SearchContextProvider = ({ children }: Props) => {
  const { search, rerank, hybrid } = useConfigContext();

  const [searchValue, setSearchValue] = useState<string>("");
  const [filterValue, setFilterValue] = useState("");
  const [conversationId, setConversationId] = useState<string | undefined>();

  // Language
  const [languageValue, setLanguageValue] = useState<SummaryLanguage>("kor");

  // History
  const [history, setHistory] = useState<HistoryItem[]>([]);

  // Basic search
  const [isSearching, setIsSearching] = useState(false);
  const [searchError, setSearchError] = useState<SearchError | undefined>();
  const [searchResults, setSearchResults] = useState<SearchResultWithSnippet[]>([]);
  const [searchTime, setSearchTime] = useState<number>(0);

  // Summarization
  const [isSummarizing, setIsSummarizing] = useState(false);
  const [summarizationError, setSummarizationError] = useState<SearchError | undefined>();
  const [summarizationResponse, setSummarizationResponse] = useState<string>();
  const [summaryTime, setSummaryTime] = useState<number>(0);
  const [summarizationQuestion, setSummarizationQuestion] = useState<string>("");

  // Citation selection
  const searchResultsRef = useRef<HTMLElement[] | null[]>([]);
  const [selectedSearchResultPosition, setSelectedSearchResultPosition] = useState<number>();

  useEffect(() => {
    setHistory(retrieveHistory());
  }, []);

  useEffect(() => {
    if (searchResults) {
      searchResultsRef.current = searchResultsRef.current.slice(0, searchResults.length);
    } else {
      searchResultsRef.current = [];
    }
  }, [searchResults]);

  const clearHistory = () => {
    setHistory([]);
    deleteHistory();
  };

  const selectSearchResultAt = (position: number) => {
    if (!searchResultsRef.current[position] || selectedSearchResultPosition === position) {
      // Reset selected position.
      setSelectedSearchResultPosition(undefined);
    } else {
      setSelectedSearchResultPosition(position);
      // Scroll to the selected search result.
      window.scrollTo({
        top: searchResultsRef.current[position]!.offsetTop - 78,
        behavior: "smooth"
      });
    }
  };

  const getLanguage = (): SummaryLanguage => (languageValue ?? "auto") as SummaryLanguage;

  const onRetry = () => {
    onSearch({ value: summarizationQuestion });
  };

  const onSearch = async ({
    value = searchValue,
    filter = filterValue,
    language = getLanguage()
  }: {
    value?: string;
    filter?: string;
    language?: SummaryLanguage;
  }) => {
    if (!value?.trim()) return;

    setSearchValue("");
    setFilterValue(filter);
    setSearchError(undefined);
    setSummarizationError(undefined);
    setLanguageValue(language);
    setSummarizationResponse(undefined);
    setSummarizationQuestion(value);

    // Save to history.
    setHistory(addHistoryItem({ query: value, filter, language }, history));

    setIsSearching(true);
    setIsSummarizing(true);
    setSelectedSearchResultPosition(undefined);

    const startTime = Date.now();
    let resultsWithSnippets;

    try {
      const onStreamEvent = (event: ApiV2.StreamEvent) => {
        switch (event.type) {
          case "requestError":
          case "genericError":
            setSearchError({
              message: "Error sending the query request"
            });
            break;

          case "error":
            setSummarizationError({ message: event.messages.join(", ") });
            break;

          case "searchResults":
            setIsSearching(false);
            setSearchTime(Date.now() - startTime);
            resultsWithSnippets = event.searchResults.map((result: SearchResult) => {
              const { pre, text, post } = parseSnippet(result.text);

              return {
                ...result,
                snippet: {
                  pre,
                  text,
                  post
                }
              };
            });

            setSearchResults(resultsWithSnippets);
            break;

          case "chatInfo":
            setConversationId(event.chatId);

            break;

          case "generationChunk":
            setSummarizationResponse(event.updatedText);
            break;

          case "generationEnd":
            setIsSummarizing(false);
            break;

          case "end":
            setSummaryTime(Date.now() - startTime);
            break;
        }
      };

      const streamQueryConfig: ApiV2.StreamQueryConfig = {
        apiKey: search.apiKey!,
        customerId: search.customerId!,
        query: value,
        corpusKey: search.corpusKey!,
        search: {
          offset: 0,
          metadataFilter: "",
          lexicalInterpolation:
            value.trim().split(" ").length > hybrid.numWords ? hybrid.lambdaLong : hybrid.lambdaShort,
          reranker:
            rerank.isEnabled && rerank.id
              ? rerank.id === mmrRerankerId
                ? {
                    type: "mmr",
                    diversityBias: 0
                  }
                : {
                    type: "customer_reranker",
                    // rnk_ prefix needed for conversion from API v1 to v2.
                    rerankerId: `rnk_${rerank.id.toString()}`
                  }
              : undefined,
          contextConfiguration: {
            sentencesBefore: 2,
            sentencesAfter: 2,
            startTag: START_TAG,
            endTag: END_TAG
          }
        },

        chat: { store: true, conversationId }
      };

      streamQueryV2({ streamQueryConfig, onStreamEvent });
    } catch (error) {
      console.log("Summary error", error);
      setIsSummarizing(false);
      setSummarizationError(error as SearchError);
      setSummarizationResponse(undefined);
      return;
    }
  };

  const reset = () => {
    // Specifically don't reset language because that's more of a
    // user preference.
    onSearch({ value: "", filter: "" });
  };

  return (
    <SearchContext.Provider
      value={{
        filterValue,
        setFilterValue,
        searchValue,
        setSearchValue,
        onSearch,
        reset,
        isSearching,
        searchError,
        searchResults,
        searchTime,
        isSummarizing,
        summarizationError,
        summarizationResponse,
        summarizationQuestion,
        summaryTime,
        language: getLanguage(),
        summaryNumResults: 7,
        summaryNumSentences: 3,
        summaryPromptName: "vectara-summary-ext-v1.2.0",
        history,
        clearHistory,
        searchResultsRef,
        selectedSearchResultPosition,
        selectSearchResultAt,
        onRetry
      }}
    >
      {children}
    </SearchContext.Provider>
  );
};

export const useSearchContext = () => {
  const context = useContext(SearchContext);
  if (context === undefined) {
    throw new Error("useSearchContext must be used within a SearchContextProvider");
  }
  return context;
};
