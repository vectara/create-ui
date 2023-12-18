import { VuiFlexContainer, VuiFlexItem, VuiSpacer, VuiSpinner, VuiTitle } from "../../contexts/ui";
import { SearchControls } from "./controls/SearchControls";
import { ExampleQuestions } from "./controls/ExampleQuestions";
import { useSearchContext } from "../../contexts/SearchContext";
import { AppHeader } from "./chrome/AppHeader";
import { useConfigContext } from "../../contexts/ConfigurationContext";
import { SearchUx } from "./SearchUx";
import "./searchView.scss";

export const SearchView = () => {
  const { isConfigLoaded, app } = useConfigContext();

  const { isSearching, searchError, searchResults, isSummarizing, summarizationError, summarizationResponse } =
    useSearchContext();

  let content;

  if (!isConfigLoaded) {
    content = (
      <VuiFlexContainer className="appSpinner" direction="column" justifyContent="center" alignItems="center">
        <VuiSpinner size="l" />
        <VuiSpacer size="l" />
        <VuiTitle size="xs">
          <h2>Loading</h2>
        </VuiTitle>
      </VuiFlexContainer>
    );
  } else if (
    !isSearching &&
    !searchError &&
    !searchResults &&
    !isSummarizing &&
    !summarizationError &&
    !summarizationResponse
  ) {
    content = <ExampleQuestions />;
  } else {
    content = <SearchUx />;
  }

  return (
    <>
      {app.isHeaderEnabled && <AppHeader />}
      <VuiFlexContainer className="searchView" direction="column" alignItems="center" spacing="none">
        {isConfigLoaded && (
          <VuiFlexItem className="searchControlsContainer">
            <SearchControls hasQuery={Boolean(isSearching || searchResults)} />
          </VuiFlexItem>
        )}

        <VuiFlexItem grow={1} className="searchContent">
          {content}
        </VuiFlexItem>
      </VuiFlexContainer>
    </>
  );
};
