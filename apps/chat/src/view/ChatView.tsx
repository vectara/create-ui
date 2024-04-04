import { Fragment, useEffect, useRef, useState } from "react";
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
  const [isReferencesOpen, setIsReferencesOpen] = useState(false);

  const appLayoutRef = useRef<HTMLDivElement>(null);
  const isScrolledToBottomRef = useRef(true);

  const updateScrollPosition = () => {
    // Scrolling UX rules:
    // * Scroll down if the last recorded scroll position was already
    //   at the bottom of the list and if the last question has resolved
    //   to an answer.
    // * If the user has scrolled to another position, then don’t
    //   auto-scroll.

    // This way if the user takes control of the scroll position, they
    // remain in control. If the user hasn’t taken control of the scroll
    // position, then the scroll feels stable (by staying at the
    // bottom) as opposed to scrolling unpredictably through the list
    // as questions resolve.
    if (isScrolledToBottomRef.current) {
      // Scroll to the bottom of the chat to keep the latest turn in view.
      appLayoutRef.current?.scrollTo({
        left: 0,
        top: appLayoutRef.current?.scrollHeight,
        behavior: "smooth"
      });
    }
  };

  useEffect(() => {
    const layoutNode = appLayoutRef.current;

    const onScrollContent = (e: Event) => {
      const isScrolledToBottom = appLayoutRef.current
        ? Math.abs(
            appLayoutRef.current.scrollHeight - appLayoutRef.current.clientHeight - appLayoutRef.current.scrollTop
          ) < 50
        : true;

      isScrolledToBottomRef.current = isScrolledToBottom;
    };

    // We're going to track the scroll position, which will determine
    // or not the user is at the bottom of the chat.
    layoutNode?.addEventListener("scroll", onScrollContent);

    return () => {
      layoutNode?.removeEventListener("scroll", onScrollContent);
    };
  }, []);

  useEffect(updateScrollPosition, [
    isSearching,
    isSummarizing,
    searchError,
    summarizationError,
    summarizationResponse,
    summarizationQuestion,
    chatHistory,
    isReferencesOpen
  ]);

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
        isLoading={isSearching || !summarizationResponse}
        isSummarizing={isSummarizing}
        question={summarizationQuestion}
        answer={summarizationResponse}
        searchResults={searchResults}
        error={searchError && <>{searchError.message}</>}
        isReferencesOpen={isReferencesOpen}
        setIsReferencesOpen={setIsReferencesOpen}
      />
    );
  }

  const chatInputClasses = classNames("chatInputContainer");

  const hasContent = isSearching || isSummarizing || chatHistory.length > 0 || summarizationQuestion;

  return (
    <>
      <AppHeader />

      <VuiAppLayout ref={appLayoutRef}>
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
                chatItems.map((item, index) => (
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
