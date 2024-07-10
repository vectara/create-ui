import { SearchResultWithSnippet } from "./types";
import { VuiFlexContainer, VuiFlexItem, VuiLink, VuiText } from "../ui";

export const ChatReference = ({ result, position }: { result: SearchResultWithSnippet; position: number }) => {
  const url = result.document_metadata.url as string;
  const text = result.snippet.text;

  return (
    <>
      <VuiFlexContainer alignItems="start" spacing="s">
        <VuiFlexItem grow={false} shrink={false}>
          <div className="chatSearchResultPosition">{position + 1}</div>
        </VuiFlexItem>

        <VuiFlexItem grow={1} shrink={1}>
          <VuiText size="s">
            <p>{url ? <VuiLink href={url}>{text}</VuiLink> : text}</p>
          </VuiText>
        </VuiFlexItem>
      </VuiFlexContainer>
    </>
  );
};
