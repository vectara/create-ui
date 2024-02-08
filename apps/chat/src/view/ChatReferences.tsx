import { VuiAccordion, VuiSpacer } from "../ui";
import { DeserializedSearchResult } from "./types";
import { ChatReference } from "./ChatReference";

type Props = {
  searchResults: DeserializedSearchResult[];
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
};

export const ChatReferences = ({ searchResults, isOpen, setIsOpen }: Props) => {
  return (
    <VuiAccordion header="Retrieved facts" isOpen={isOpen} setIsOpen={setIsOpen}>
      <VuiSpacer size="s" />
      {searchResults.map((result, i) => (
        <div key={i}>
          <ChatReference result={result} position={i} />
          {i < searchResults.length - 1 && <VuiSpacer size="s" />}
        </div>
      ))}
    </VuiAccordion>
  );
};
