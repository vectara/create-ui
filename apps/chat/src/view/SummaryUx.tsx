import { VuiSpacer, VuiFlexContainer, VuiFlexItem, VuiText, VuiTextColor, truncateEnd } from "../ui";
import { sanitizeCitations, reorderCitations, applyCitationOrder } from "../ui/utils/citations";
import { useSearchContext } from "../contexts/SearchContext";
import { DeserializedSearchResult } from "./types";
import { Summary } from "./summary/Summary";

export const SummaryUx = () => {
  const { isSearching, searchResults, isSummarizing, summarizationResponse } = useSearchContext();

  const rawSummary = summarizationResponse;
  const unorderedSummary = sanitizeCitations(rawSummary);

  let summary = "";
  let summarySearchResults: DeserializedSearchResult[] = [];

  if (!isSummarizing && unorderedSummary) {
    summary = reorderCitations(unorderedSummary);
    if (searchResults) {
      summarySearchResults = applyCitationOrder(searchResults, unorderedSummary);
    }
  }

  return (
    <>
      {summary && (
        <>
          <VuiSpacer size="l" />

          <Summary summary={summary} />

          {summarySearchResults && summarySearchResults.length > 0 && (
            <>
              <VuiSpacer size="m" />

              {summarySearchResults.map((result, i) => (
                <div key={i}>
                  <Reference result={result} position={i} />
                  {i < summarySearchResults.length - 1 && <VuiSpacer size="s" />}
                </div>
              ))}
            </>
          )}
        </>
      )}
    </>
  );
};

const Reference = ({ result, position }: { result: DeserializedSearchResult; position: number }) => {
  const {
    snippet: { post, text }
  } = result;

  return (
    <>
      <VuiFlexContainer alignItems="start" spacing="s">
        <VuiFlexItem grow={false} shrink={false}>
          <div className="searchResultPosition">{position + 1}</div>
        </VuiFlexItem>

        <VuiFlexItem grow={1} shrink={1}>
          <VuiText size="s">
            <p>
              <strong>{text}</strong> <VuiTextColor color="subdued">{truncateEnd(post, 140)}</VuiTextColor>
            </p>
          </VuiText>
        </VuiFlexItem>
      </VuiFlexContainer>
    </>
  );
};
