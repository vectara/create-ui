import { DeserializedSearchResult } from "./types";
import { VuiFlexContainer, VuiFlexItem, VuiLink, VuiText } from "../ui";

export const ChatReference = ({ result, position }: { result: DeserializedSearchResult; position: number }) => {
  const {
    snippet: { text },
    url
  } = result;

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
