import { forwardRef } from "react";
import { VuiText, VuiTextColor, VuiSearchResult } from "../../ui";
import { truncateEnd, truncateStart } from "../../ui/utils/truncateString";
import { DeserializedSearchResult } from "../types";
import "./SearchResult.scss";

type Props = {
  result: DeserializedSearchResult;
  position: number;
  isSelected: boolean;
};

const CONTEXT_MAX_LENGTH = 200;

export const SearchResult = forwardRef<HTMLDivElement | null, Props>(({ result, position, isSelected }: Props, ref) => {
  const {
    title,
    url,
    snippet: { pre, post, text }
  } = result;

  return (
    <VuiSearchResult
      ref={ref}
      isSelected={isSelected}
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
