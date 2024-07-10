export type DocMetadata = {
  name: string;
  value: string;
};

export type SearchError = {
  message?: string;
  response?: {
    data?: {
      message?: string;
    };
  };
};

export const standardRerankerId = 272725717;
export const mmrRerankerId = 272725718;

export type SearchResult = {
  document_id: string;
  document_metadata: Record<string, unknown>;
  part_metadata: Record<string, unknown>;
  score: number;
  text: string;
};

export type SearchResultWithSnippet = SearchResult & {
  snippet: {
    pre: string;
    text: string;
    post: string;
  };
};
