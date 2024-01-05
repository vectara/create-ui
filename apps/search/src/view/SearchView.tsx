import { VuiFlexContainer, VuiFlexItem } from "../ui";
import { SearchControls } from "./controls/SearchControls";
import { ExampleQuestions } from "./controls/ExampleQuestions";
import { useSearchContext } from "../contexts/SearchContext";
import { AppHeader } from "./chrome/AppHeader";
import { SearchUx } from "./SearchUx";
import "./searchView.scss";

export const SearchView = () => {
  const { isSearching, searchError, searchResults } = useSearchContext();

  let content;

  if (!isSearching && !searchError && !searchResults) {
    content = <ExampleQuestions />;
  } else {
    content = <SearchUx />;
  }

  return (
    <>
      <AppHeader />
      <VuiFlexContainer className="searchView" direction="column" alignItems="center" spacing="none">
        <VuiFlexItem className="searchControlsContainer">
          <SearchControls hasQuery={Boolean(isSearching || searchResults)} />
        </VuiFlexItem>

        <VuiFlexItem grow={1} className="searchContent" alignItems="start">
          {content}
        </VuiFlexItem>
      </VuiFlexContainer>
    </>
  );
};
