/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { createContext, useContext, ReactNode, useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { SearchError, mmrRerankerId, SearchResult, SearchResultWithSnippet } from "../view/types";
import { useConfigContext } from "./ConfigurationContext";
import { HistoryItem, addHistoryItem, deleteHistory, retrieveHistory } from "./history";
import { ApiV2, streamQueryV2 } from "@vectara/stream-query-client";
import { END_TAG, START_TAG, parseSnippet } from "../utils/parseSnippet";

interface SearchContextType {
  filterValue: string;
  setFilterValue: (source: string) => void;
  searchValue: string;
  setSearchValue: (value: string) => void;
  onSearch: ({ value, filter, isPersistable }: { value?: string; filter?: string; isPersistable?: boolean }) => void;
  reset: () => void;
  isSearching: boolean;
  searchError: SearchError | undefined;
  searchResults: SearchResultWithSnippet[] | undefined;
  searchTime: number;
  history: HistoryItem[];
  clearHistory: () => void;
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

  // History
  const [history, setHistory] = useState<HistoryItem[]>([]);

  // Basic search
  const [isSearching, setIsSearching] = useState(false);
  const [searchError, setSearchError] = useState<SearchError | undefined>();
  const [searchResults, setSearchResults] = useState<SearchResultWithSnippet[] | undefined>(undefined);
  const [searchTime, setSearchTime] = useState<number>(0);

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
      isPersistable: false
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams]); // TODO: Add onSearch and fix infinite render loop

  const clearHistory = () => {
    setHistory([]);
    deleteHistory();
  };

  const onSearch = async ({
    value = searchValue,
    filter = filterValue,
    isPersistable = true
  }: {
    value?: string;
    filter?: string;
    isPersistable?: boolean;
  }) => {
    setSearchError(undefined);
    setSearchValue(value);
    setFilterValue(filter);
    setIsSearching(true);

    if (value?.trim()) {
      // Save to history.
      setHistory(addHistoryItem({ query: value, filter }, history));

      // Persist to URL, only if the search executes. This way the prior
      // search that was persisted remains in the URL if the search doesn't execute.
      if (isPersistable) {
        setSearchParams(
          new URLSearchParams(`?query=${encodeURIComponent(value)}&filter=${encodeURIComponent(filter)}`)
        );
      }

      const startTime = Date.now();
      let resultsWithSnippets;

      try {
        const onStreamEvent = (event: ApiV2.StreamEvent) => {
          switch (event.type) {
            case "requestError":
            case "error":
            case "genericError":
            case "unexpectedError":
              setSearchError({
                message: "Error sending the query request"
              });
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
          }
        };

        streamQueryV2({ streamQueryConfig, onStreamEvent });
      } catch (error) {
        console.log("Search error", error);
        setIsSearching(false);
        setSearchError(error as SearchError);
        setSearchResults(undefined);
      }
    } else {
      // Persist to URL.
      if (isPersistable) setSearchParams(new URLSearchParams(""));

      setSearchResults(undefined);
      setIsSearching(false);
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
        history,
        clearHistory
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
