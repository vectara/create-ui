import { createContext, useContext, ReactNode, useState } from "react";
import { SearchResultWithSnippet } from "../view/types";
import { useSearchContext } from "./SearchContext";

export type ChatTurn = {
  id: string;
  question: string;
  answer: string;
  results: SearchResultWithSnippet[];
};

interface ChatContextType {
  chatHistory: ChatTurn[];
  onSubmitChat: (query?: string) => void;
}

const ChatContext = createContext<ChatContextType | undefined>(undefined);

type Props = {
  children: ReactNode;
};

export const ChatContextProvider = ({ children }: Props) => {
  const {
    isSearching,
    isSummarizing,
    setSearchValue,
    onSearch,
    searchError,
    searchResults,
    summarizationError,
    summarizationResponse,
    summarizationQuestion
  } = useSearchContext();

  const [chatHistory, setChatHistory] = useState<ChatTurn[]>([]);

  // The search state is surfaced as the latest chat turn. When a new
  // query is issued, the old search state is added to the chat history as
  // another turn.
  const addToChatHistory = (chatTurn: ChatTurn) => {
    if (!chatTurn) return;

    setChatHistory((chatHistory) => {
      return [...chatHistory, { ...chatTurn }];
    });
  };

  const onSubmitChat = (query?: string) => {
    if (isSearching || isSummarizing) return;

    if (!searchError && !summarizationError && summarizationResponse) {
      addToChatHistory({
        id: "0",
        question: summarizationQuestion,
        answer: summarizationResponse ?? "",
        results: searchResults ?? []
      });
    }

    onSearch({ value: query });
    setSearchValue("");
  };

  return (
    <ChatContext.Provider
      value={{
        chatHistory,
        onSubmitChat
      }}
    >
      {children}
    </ChatContext.Provider>
  );
};

export const useChatContext = () => {
  const context = useContext(ChatContext);
  if (context === undefined) {
    throw new Error("useChatContext must be used within a ChatContextProvider");
  }
  return context;
};
