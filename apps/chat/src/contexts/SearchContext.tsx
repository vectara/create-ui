/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { createContext, useContext, ReactNode, useState, useEffect, useRef } from "react";
import { DeserializedSearchResult, SearchResponse, SummaryLanguage, SearchError } from "../view/types";
import { useConfigContext } from "./ConfigurationContext";
import { sendSearchRequest } from "./sendSearchRequest";
import { HistoryItem, addHistoryItem, deleteHistory, retrieveHistory } from "./history";
import { deserializeSearchResponse } from "../utils/deserializeSearchResponse";

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
  searchResults: DeserializedSearchResult[] | undefined;
  searchTime: number;
  isSummarizing: boolean;
  summarizationError: SearchError | undefined;
  summarizationResponse: SearchResponse | undefined;
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

let searchCount = 0;

export const SearchContextProvider = ({ children }: Props) => {
  const { search, rerank, hybrid } = useConfigContext();

  const [searchValue, setSearchValue] = useState<string>("");
  const [filterValue, setFilterValue] = useState("");

  // Language
  const [languageValue, setLanguageValue] = useState<SummaryLanguage>();

  // History
  const [history, setHistory] = useState<HistoryItem[]>([]);

  // Basic search
  const [isSearching, setIsSearching] = useState(false);
  const [searchError, setSearchError] = useState<SearchError | undefined>();
  const [searchResponse, setSearchResponse] = useState<SearchResponse>();
  const [searchTime, setSearchTime] = useState<number>(0);

  // Summarization
  const [isSummarizing, setIsSummarizing] = useState(false);
  const [summarizationError, setSummarizationError] = useState<SearchError | undefined>();
  const [summarizationResponse, setSummarizationResponse] = useState<SearchResponse>();
  const [summaryTime, setSummaryTime] = useState<number>(0);
  const [summarizationQuestion, setSummarizationQuestion] = useState<string>("");

  // Citation selection
  const searchResultsRef = useRef<HTMLElement[] | null[]>([]);
  const [selectedSearchResultPosition, setSelectedSearchResultPosition] = useState<number>();

  useEffect(() => {
    setHistory(retrieveHistory());
  }, []);

  const searchResults = deserializeSearchResponse(searchResponse);

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

    const searchId = ++searchCount;

    setSearchValue("");
    setFilterValue(filter);
    setSearchError(undefined);
    setSummarizationError(undefined);
    setLanguageValue(language);
    setSummarizationResponse(undefined);
    setSummarizationQuestion(value);

    // Save to history.
    setHistory(addHistoryItem({ query: value, filter, language }, history));

    // First call - only search results - should come back quicky while we wait for summarization
    setIsSearching(true);
    setIsSummarizing(true);
    setSelectedSearchResultPosition(undefined);

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
      setIsSummarizing(false);
      setSearchError(error as SearchError);
      setSearchResponse(undefined);
      return;
    }

    // Second call - search and summarize (if summary is enabled); this may take a while to return results
    if (initialSearchResponse.response.length > 0) {
      const startTime = Date.now();
      try {
        const response = await sendSearchRequest({
          filter,
          queryValue: value,
          summaryMode: true,
          rerank: rerank.isEnabled,
          rerankNumResults: rerank.numResults,
          rerankerId: rerank.id,
          rerankDiversityBias: rerank.diversityBias,
          summaryNumResults: SUMMARY_NUM_RESULTS,
          summaryNumSentences: 3,
          summaryPromptName: "vectara-summary-ext-v1.2.0",
          hybridNumWords: hybrid.numWords,
          hybridLambdaLong: hybrid.lambdaLong,
          hybridLambdaShort: hybrid.lambdaShort,
          language,
          customerId: search.customerId!,
          corpusId: search.corpusId!,
          endpoint: search.endpoint!,
          apiKey: search.apiKey!,
          chat: { conversationId: "" }
        });
        const totalTime = Date.now() - startTime;

        // If we send multiple requests in rapid succession, we only want to
        // display the results of the most recent request.
        if (searchId === searchCount) {
          setIsSummarizing(false);
          setSummarizationError(undefined);
          setSummarizationResponse(response);
          setSummaryTime(totalTime);
        }
      } catch (error) {
        console.log("Summary error", error);
        setIsSummarizing(false);
        setSummarizationError(error as SearchError);
        setSummarizationResponse(undefined);
        return;
      }
    } else {
      setIsSummarizing(false);
      setSummarizationError({
        message: "No search results to summarize"
      });
      setSummarizationResponse(undefined);
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
