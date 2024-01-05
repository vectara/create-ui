/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { createContext, useContext, ReactNode, useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { DeserializedSearchResult, SearchResponse, SearchError } from "../view/types";
import { useConfigContext } from "./ConfigurationContext";
import { sendSearchRequest } from "./sendSearchRequest";
import { HistoryItem, addHistoryItem, deleteHistory, retrieveHistory } from "./history";
import { deserializeSearchResponse } from "../utils/deserializeSearchResponse";

interface SearchContextType {
  filterValue: string;
  setFilterValue: (source: string) => void;
  searchValue: string;
  setSearchValue: (value: string) => void;
  onSearch: ({ value, filter, isPersistable }: { value?: string; filter?: string; isPersistable?: boolean }) => void;
  reset: () => void;
  isSearching: boolean;
  searchError: SearchError | undefined;
  searchResults: DeserializedSearchResult[] | undefined;
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

let searchCount = 0;

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
  const [searchResponse, setSearchResponse] = useState<SearchResponse>();
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

  const searchResults = deserializeSearchResponse(searchResponse);

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
    const searchId = ++searchCount;

    setSearchValue(value);
    setFilterValue(filter);

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

      setIsSearching(true);

      let initialSearchResponse;

      try {
        const startTime = Date.now();
        initialSearchResponse = await sendSearchRequest({
          filter,
          queryValue: value,
          rerank: rerank.isEnabled,
          rerankNumResults: rerank.numResults,
          rerankerId: rerank.id,
          rerankDiversityBias: rerank.diversityBias,
          hybridNumWords: hybrid.numWords,
          hybridLambdaLong: hybrid.lambdaLong,
          hybridLambdaShort: hybrid.lambdaShort,
          customerId: search.customerId!,
          corpusId: search.corpusId!,
          endpoint: search.endpoint!,
          apiKey: search.apiKey!
        });
        const totalTime = Date.now() - startTime;

        // If we send multiple requests in rapid succession, we only want to
        // display the results of the most recent request.
        if (searchId === searchCount) {
          setIsSearching(false);
          setSearchTime(totalTime);
          setSearchResponse(initialSearchResponse);

          if (initialSearchResponse.response.length > 0) {
            setSearchError(undefined);
          } else {
            setSearchError({
              message: "There weren't any results for your search."
            });
          }
        }
      } catch (error) {
        console.log("Search error", error);
        setIsSearching(false);
        setSearchError(error as SearchError);
        setSearchResponse(undefined);
      }
    } else {
      // Persist to URL.
      if (isPersistable) setSearchParams(new URLSearchParams(""));

      setSearchResponse(undefined);
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
