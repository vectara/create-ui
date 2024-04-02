import { BiError } from "react-icons/bi";
import Markdown from "markdown-to-jsx";
import { VuiButtonSecondary, VuiFlexContainer, VuiFlexItem, VuiIcon, VuiSpacer, VuiSpinner, VuiText } from "../ui";
import { applyCitationOrder, extractCitations, reorderCitations } from "../ui/utils/citations";
import { DeserializedSearchResult } from "./types";
import { ChatReferences } from "./ChatReferences";
import { SUMMARY_NUM_RESULTS, useSearchContext } from "../contexts/SearchContext";

const removeCitations = (text: string) => text.replace(/ ?\[\d+\]/g, "");

const markDownCitations = (summary: string) => {
  const citations = extractCitations(summary);
  return citations
    .reduce((accum, { text, references }, index) => {
      if (references) {
        accum.push(text);

        const marginBefore = text ? text[text.length - 1] !== " " : false;
        if (marginBefore) {
          accum.push(" ");
        }

        references.forEach((reference, referenceIndex) => {
          if (referenceIndex > 0) {
            accum.push(" ");
          }

          accum.push(`<SummaryCitation reference={${reference}} />`);
        });
      } else {
        accum.push(text);
      }

      return accum;
    }, [] as string[])
    .join(" ");
};

const SummaryCitation = ({ reference }: { reference: string }) => {
  return (
    <>
      {" "}
      <span className="chatSummaryCitation">{reference}</span>
    </>
  );
};

type Props = {
  isLoading?: boolean;
  isSummarizing?: boolean;
  question?: string;
  answer?: string;
  searchResults?: DeserializedSearchResult[];
  error?: React.ReactNode;
  isReferencesOpen?: boolean;
  setIsReferencesOpen?: (isOpen: boolean) => void;
};

export const ChatItem = ({
  isLoading,
  isSummarizing,
  question,
  answer,
  searchResults,
  error,
  isReferencesOpen,
  setIsReferencesOpen
}: Props) => {
  const { onRetry } = useSearchContext();

  let content;

  if (error) {
    content = (
      <div className="chatMessageContainer chatMessageContainer--error">
        <div className="chatMessage">
          <VuiFlexContainer alignItems="center" spacing="xs">
            <VuiFlexItem grow={false}>
              <VuiIcon color="danger">
                <BiError />
              </VuiIcon>
            </VuiFlexItem>

            <VuiFlexItem grow={false}>{error}</VuiFlexItem>
          </VuiFlexContainer>

          <VuiSpacer size="s" />

          <VuiButtonSecondary color="primary" size="m" onClick={() => onRetry()}>
            Try again
          </VuiButtonSecondary>
        </div>
      </div>
    );
  } else if (isLoading) {
    content = (
      <div className="chatMessageContainer chatMessageContainer--thinking">
        <div className="chatMessage">🧠 Thinking&hellip;</div>
      </div>
    );
  } else if (answer) {
    const reorderedSearchResults = (searchResults ? applyCitationOrder(searchResults, answer) : []).slice(
      0,
      SUMMARY_NUM_RESULTS
    );
    const reorderedAnswer = searchResults ? reorderCitations(answer) : answer;
    const sanitizedAnswer = isReferencesOpen ? markDownCitations(reorderedAnswer) : removeCitations(reorderedAnswer);

    content = (
      <div className="chatMessageContainer chatMessageContainer--answer">
        <div className="chatMessage">
          <VuiText size="m">
            <Markdown
              children={sanitizedAnswer}
              options={{
                forceInline: true,
                overrides: {
                  SummaryCitation: {
                    component: SummaryCitation
                  }
                }
              }}
            />
            <span>{isSummarizing && <VuiSpinner size="xs" />}</span>
          </VuiText>

          {reorderedSearchResults && reorderedSearchResults.length > 0 && (
            <>
              <VuiSpacer size="s" />

              <ChatReferences
                searchResults={reorderedSearchResults}
                isOpen={isReferencesOpen}
                setIsOpen={setIsReferencesOpen}
              />
            </>
          )}
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="chatMessageContainer chatMessageContainer--question">
        <div className="chatMessage">{question}</div>
      </div>

      <VuiSpacer size="xs" />

      {content}
    </>
  );
};
