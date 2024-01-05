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

export type SearchResponseDoc = {
  id: string;
  metadata: DocMetadata[];
};

export type SearchResponseResult = {
  corpusKey: {
    corpusId: string;
    customerId: string;
    dim: string[];
  };
  documentIndex: string;
  resultLength: number;
  resultOffset: number;
  score: number;
  text: string;
};

export type SearchResponse = {
  document: SearchResponseDoc[];
  response: SearchResponseResult[];
};

export type CombinedResult = {
  document: SearchResponseDoc;
  response: SearchResponseResult;
};

export type CombinedResults = CombinedResult[];

export type DeserializedSearchResult = {
  id: string;
  snippet: {
    pre: string;
    text: string;
    post: string;
  };
  source: string;
  url: string;
  title: string;
  metadata: Record<string, unknown>;
};

export const standardRerankerId = 272725717;
export const mmrRerankerId = 272725718;
