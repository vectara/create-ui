import { forwardRef } from "react";
import { VuiText, VuiTextColor, VuiSearchResult } from "../../ui";
import { SearchResultWithSnippet } from "../types";
import "./SearchResult.scss";

type Props = {
  result: SearchResultWithSnippet;
  position: number;
  isSelected: boolean;
};

export const SearchResult = forwardRef<HTMLDivElement | null, Props>(({ result, position, isSelected }: Props, ref) => {
  const url = result.document_metadata.url as string;
  const title = result.document_metadata.title as string;
  const { pre, text, post } = result.snippet;

  return (
    <VuiSearchResult
      ref={ref}
      isSelected={isSelected}
      result={{
        title,
        url,
        snippet: {
          pre,
          text,
          post
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
