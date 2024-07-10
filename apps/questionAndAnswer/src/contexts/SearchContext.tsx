/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { createContext, useContext, ReactNode, useState, useEffect, useRef } from "react";
import { useSearchParams } from "react-router-dom";
import { SummaryLanguage, SearchError, mmrRerankerId, SearchResult, SearchResultWithSnippet } from "../view/types";
import { useConfigContext } from "./ConfigurationContext";
import { HistoryItem, addHistoryItem, deleteHistory, retrieveHistory } from "./history";
import { ApiV2, streamQueryV2 } from "@vectara/stream-query-client";
import { END_TAG, START_TAG } from "../utils/parseSnippet";

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
}

const SearchContext = createContext<SearchContextType | undefined>(undefined);

const getQueryParam = (urlParams: URLSearchParams, key: string) => {
  const value = urlParams.get(key);
  if (value) return decodeURIComponent(value);
  return undefined;
};

type Props = {
  children: ReactNode;
};

export const SearchContextProvider = ({ children }: Props) => {
  const { search, rerank, hybrid } = useConfigContext();

  const [searchValue, setSearchValue] = useState<string>("");
  const [filterValue, setFilterValue] = useState("");

  const [searchParams, setSearchParams] = useSearchParams();

  // Language
  const [languageValue, setLanguageValue] = useState<SummaryLanguage>();

  // History
  const [history, setHistory] = useState<HistoryItem[]>([]);

  // Basic search
  const [isSearching, setIsSearching] = useState(false);
  const [searchError, setSearchError] = useState<SearchError | undefined>();
  const [searchResults, setSearchResults] = useState<SearchResultWithSnippet[] | undefined>(undefined);
  const [searchTime, setSearchTime] = useState<number>(0);

  // Summarization
  const [isSummarizing, setIsSummarizing] = useState(false);
  const [summarizationError, setSummarizationError] = useState<SearchError | undefined>();
  const [summarizationResponse, setSummarizationResponse] = useState<string>();
  const [summaryTime, setSummaryTime] = useState<number>(0);

  // Citation selection
  const searchResultsRef = useRef<HTMLElement[] | null[]>([]);
  const [selectedSearchResultPosition, setSelectedSearchResultPosition] = useState<number>();

  useEffect(() => {
    setHistory(retrieveHistory());
  }, []);

  // Use the browser back and forward buttons to traverse history
  // of searches, and bookmark or share the URL.
  useEffect(() => {
    // Search params are updated as part of calling onSearch, so we don't
    // want to trigger another search when the search params change if that
    // search is already in progress.
    if (isSearching) return;

    const urlParams = new URLSearchParams(searchParams);

    onSearch({
      // Set to an empty string to wipe out any existing search value.
      value: getQueryParam(urlParams, "query") ?? "",
      filter: getQueryParam(urlParams, "filter"),
      language: getQueryParam(urlParams, "language") as SummaryLanguage | undefined,
      isPersistable: false
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams]); // TODO: Add onSearch and fix infinite render loop

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

  const onSearch = async ({
    value = searchValue,
    filter = filterValue,
    language = getLanguage(),
    isPersistable = true
  }: {
    value?: string;
    filter?: string;
    language?: SummaryLanguage;
    isPersistable?: boolean;
  }) => {
    setSearchValue(value);
    setFilterValue(filter);
    setLanguageValue(language);
    setSearchError(undefined);
    setSummarizationError(undefined);
    setSummarizationResponse(undefined);

    if (value?.trim()) {
      // Save to history.
      setHistory(addHistoryItem({ query: value, filter, language }, history));

      // Persist to URL, only if the search executes. This way the prior
      // search that was persisted remains in the URL if the search doesn't execute.
      if (isPersistable) {
        setSearchParams(
          new URLSearchParams(
            `?query=${encodeURIComponent(value)}&filter=${encodeURIComponent(filter)}&language=${encodeURIComponent(
              language
            )}`
          )
        );
      }

      // First call - only search results - should come back quicky while we wait for summarization
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
            case "unexpectedError":
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
                const startTagSplit = result.text.split(START_TAG);
                const pre = startTagSplit[0];
                let text = startTagSplit[1];

                const endTagSplit = text.split(END_TAG);
                text = endTagSplit[0];
                const post = endTagSplit[1];

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
              // If sentences/chars context is not displayed properly,
              // you may need to adjust the CONTEXT_MAX_LENGTH variable
              // in the components that display reference snippets.
              sentencesBefore: 2,
              sentencesAfter: 2,
              startTag: START_TAG,
              endTag: END_TAG
            }
          },
          chat: { store: true }
        };

        streamQueryV2({ streamQueryConfig, onStreamEvent });
      } catch (error) {
        console.log("Summary error", error);
        setIsSummarizing(false);
        setSummarizationError(error as SearchError);
        setSummarizationResponse(undefined);
        setSearchResults(undefined);
        return;
      }
    } else {
      // Persist to URL.
      if (isPersistable) setSearchParams(new URLSearchParams(""));

      setSearchResults(undefined);
      setSummarizationResponse(undefined);
      setIsSearching(false);
      setIsSummarizing(false);
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
        summaryTime,
        language: getLanguage(),
        summaryNumResults: 7,
        summaryNumSentences: 3,
        summaryPromptName: "vectara-summary-ext-v1.2.0",
        history,
        clearHistory,
        searchResultsRef,
        selectedSearchResultPosition,
        selectSearchResultAt
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
