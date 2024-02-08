import { Fragment } from "react";
import classNames from "classnames";
import { VuiAppContent, VuiAppLayout, VuiFlexContainer, VuiFlexItem, VuiSpacer, VuiText, VuiTextColor } from "../ui";
import { useSearchContext } from "../contexts/SearchContext";
import { useChatContext } from "../contexts/ChatContext";
import { AppHeader } from "./chrome/AppHeader";
import { QueryInput } from "./controls/QueryInput";
import { ExampleQuestions } from "./controls/ExampleQuestions";
import { ChatItem } from "./ChatItem";
import "./chatView.scss";

export const ChatView = () => {
  const {
    isSearching,
    isSummarizing,
    searchValue,
    setSearchValue,
    searchError,
    searchResults,
    summarizationError,
    summarizationResponse,
    summarizationQuestion
  } = useSearchContext();
  const { onSubmitChat, chatHistory } = useChatContext();

  const chatItems = chatHistory.map((turn, index) => {
    const { question, answer } = turn;
    return <ChatItem key={index} question={question} answer={answer} />;
  });

  // If a query has been recorded to the queryState then it's either
  // outstanding or has resolved to an answer or error. Either way, we
  // want to surface it in the chat history.
  if (isSearching || isSummarizing || summarizationResponse || searchError || summarizationError) {
    chatItems.push(
      <ChatItem
        isLoading={isSearching || isSummarizing}
        question={summarizationQuestion}
        answer={summarizationResponse?.summary[0].text}
        searchResults={searchResults}
        error={searchError && <>{searchError.message}</>}
      />
    );
  }

  const chatInputClasses = classNames("chatInputContainer", {
    "chatInputContainer-hasChatHistory": !chatHistory.length
  });

  const hasContent = isSearching || isSummarizing || chatHistory.length > 0 || summarizationQuestion;

  return (
    <>
      <AppHeader />

      <VuiAppLayout>
        <VuiAppContent className="appContent" fullWidth={false} padding="none">
          <VuiFlexContainer direction="column" className="appContent__inner" spacing="none">
            <VuiFlexItem grow={1}>
              <VuiSpacer size="xl" />

              {!hasContent ? (
                <div className="exampleQuestionsContainer">
                  <VuiText>
                    <p>
                      <VuiTextColor color="subdued">Try out these example questions</VuiTextColor>
                    </p>
                  </VuiText>

                  <VuiSpacer size="m" />

                  <ExampleQuestions />
                </div>
              ) : (
                chatItems.map((item: any, index: number) => (
                  <Fragment key={index}>
                    {item}
                    {index < chatItems.length - 1 ? <VuiSpacer size="m" /> : <VuiSpacer size="xl" />}
                  </Fragment>
                ))
              )}
            </VuiFlexItem>

            <VuiFlexItem grow={false} shrink={false} className={chatInputClasses}>
              <QueryInput
                placeholder="Chat with your AI assistant"
                buttonLabel="Send"
                query={searchValue}
                setQuery={setSearchValue}
                isDisabled={isSearching || isSummarizing}
                search={() => onSubmitChat()}
              />

              <VuiSpacer size="xl" />
            </VuiFlexItem>
          </VuiFlexContainer>
        </VuiAppContent>
      </VuiAppLayout>
    </>
  );
};
