import { forwardRef } from "react";
import { VuiText, VuiTextColor, VuiSearchResult } from "../../ui";
import { truncateEnd, truncateStart } from "../../ui/utils/truncateString";
import { SearchResultWithSnippet } from "../types";
import "./SearchResult.scss";

type Props = {
  result: SearchResultWithSnippet;
  position: number;
};

// Vectara provides a requested number of sentences/characters before/after relevant reference snippets.
// This variable allows for controlling the length of the text actually rendered to the screen.
const CONTEXT_MAX_LENGTH = 200;

export const SearchResult = forwardRef<HTMLDivElement | null, Props>(({ result, position }: Props, ref) => {
  const url = result.document_metadata.url as string;
  const title = result.document_metadata.title as string;
  const { pre, text, post } = result.snippet;

  return (
    <VuiSearchResult
      ref={ref}
      result={{
        title,
        url,
        snippet: {
          pre: truncateStart(pre, CONTEXT_MAX_LENGTH),
          text,
          post: truncateEnd(post, CONTEXT_MAX_LENGTH)
        }
      }}
      position={position + 1}
      subTitle={
        url && (
          <VuiText size="s" className="searchResultSiteCategory">
            <p>
              <VuiTextColor color="subdued">{url}</VuiTextColor>
            </p>
          </VuiText>
        )
      }
    />
  );
});
