import { BiDetail } from "react-icons/bi";
import {
  VuiDrawer,
  VuiFlexContainer,
  VuiFlexItem,
  VuiHorizontalRule,
  VuiIcon,
  VuiSearchResult,
  VuiSpacer,
  VuiText,
  VuiTextColor,
  VuiTitle
} from "../../ui";
import { useSearchContext } from "../../contexts/SearchContext";
import "./searchResultsDrawer.scss";
import { parseSnippet } from "../../utils/parseSnippet";

type Props = {
  isOpen: boolean;
  onClose: () => void;
};

export const SearchResultsDrawer = ({ isOpen, onClose }: Props) => {
  const { searchValue, searchResults } = useSearchContext();

  return (
    <VuiDrawer
      isOpen={isOpen}
      onClose={onClose}
      title={
        <VuiFlexContainer justifyContent="spaceBetween" alignItems="center" spacing="xs">
          <VuiFlexItem>
            <VuiIcon size="s">
              <BiDetail />
            </VuiIcon>
          </VuiFlexItem>

          <VuiFlexItem grow={1}>
            <VuiTitle size="s">
              <h2>Review search results</h2>
            </VuiTitle>
          </VuiFlexItem>
        </VuiFlexContainer>
      }
    >
      <VuiText size="l">
        <p>{searchValue}</p>
      </VuiText>

      <VuiSpacer size="xs" />

      <VuiHorizontalRule />

      <VuiSpacer size="m" />

      <VuiText>
        <p>
          <VuiTextColor color="subdued">
            These are all of the search results retrieved for this query. Not all of them will be used to generate a
            summary.
          </VuiTextColor>
        </p>
      </VuiText>

      <VuiSpacer size="m" />

      <div className="searchResultsDrawerResults">
        {searchResults?.map((result, index) => {
          const { pre, text, post } = parseSnippet(result.text);

          return (
            <VuiSearchResult
              key={result.text}
              result={{
                title: result.document_metadata.title as string,
                url: result.document_metadata.url as string,
                snippet: {
                  pre,
                  text,
                  post
                }
              }}
              position={index + 1}
              subTitle={
                <VuiText size="s">
                  <p>
                    <VuiTextColor color="subdued">Source: {result.document_metadata.source as string}</VuiTextColor>
                  </p>
                </VuiText>
              }
            />
          );
        })}
      </div>

      <VuiSpacer size="xl" />
    </VuiDrawer>
  );
};
