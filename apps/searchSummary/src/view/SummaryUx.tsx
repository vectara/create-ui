import { VuiSpacer, VuiTitle, VuiSummary, VuiFlexContainer, VuiFlexItem } from "../ui";
import { sanitizeCitations, reorderCitations, applyCitationOrder } from "../ui/utils/citations";
import { useSearchContext } from "../contexts/SearchContext";
import { SearchResultList } from "./results/SearchResultList";
import { ProgressReport } from "./progressReport/ProgressReport";
import { SummaryCitation } from "./summary/SummaryCitation";
import { SearchResultWithSnippet } from "./types";
import { ConfidenceBadge } from "./summary/ConfidenceBadge";

export const SummaryUx = () => {
  const {
    isSearching,
    searchResults,
    isSummarizing,
    summarizationResponse,
    fcs,
    searchResultsRef,
    selectedSearchResultPosition
  } = useSearchContext();

  const rawSummary = summarizationResponse;
  const unorderedSummary = sanitizeCitations(rawSummary);

  let summary = "";
  let summarySearchResults: SearchResultWithSnippet[] = [];

  if (unorderedSummary) {
    summary = reorderCitations(unorderedSummary);
    if (searchResults) {
      summarySearchResults = applyCitationOrder(searchResults, unorderedSummary);
    }
  }

  return (
    <>
      <ProgressReport isSearching={isSearching} isSummarizing={isSummarizing} />

      {summary && (
        <>
          <VuiSpacer size="l" />

          <VuiFlexContainer spacing="none" alignItems="center" justifyContent="spaceBetween" fullWidth>
            <VuiFlexItem>
              <VuiTitle size="s">
                <h2 style={{ display: "flex", alignItems: "center" }}>
                  <strong>Summary</strong>
                </h2>
              </VuiTitle>
            </VuiFlexItem>

            {fcs && (
              <VuiFlexItem>
                <ConfidenceBadge fcs={fcs} />
              </VuiFlexItem>
            )}
          </VuiFlexContainer>

          <VuiSpacer size="s" />

          <VuiSummary summary={summary} SummaryCitation={SummaryCitation} />

          <VuiSpacer size="l" />

          {summarySearchResults.length > 0 && (
            <>
              <VuiTitle size="s">
                <h2>
                  <strong>References</strong>
                </h2>
              </VuiTitle>

              <VuiSpacer size="m" />

              <SearchResultList
                results={summarySearchResults}
                selectedSearchResultPosition={selectedSearchResultPosition}
                setSearchResultRef={(el: HTMLDivElement | null, index: number) =>
                  (searchResultsRef.current[index] = el)
                }
              />
            </>
          )}
        </>
      )}
    </>
  );
};
