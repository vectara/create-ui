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

export const SUMMARY_LANGUAGES = [
  "auto",
  "eng",
  "deu",
  "fra",
  "zho",
  "kor",
  "ara",
  "rus",
  "tha",
  "nld",
  "ita",
  "por",
  "spa",
  "jpn",
  "pol",
  "tur",
  "heb",
  "vie",
  "ind",
  "ces",
  "ukr",
  "ell",
  "fas",
  "hin",
  "urd",
  "swe",
  "ben",
  "msa",
  "ron"
] as const;

export type SummaryLanguage = (typeof SUMMARY_LANGUAGES)[number];

const codeToLanguageMap: Record<SummaryLanguage, string> = {
  auto: "Same as query",
  eng: "English",
  deu: "German",
  fra: "French",
  zho: "Chinese",
  kor: "Korean",
  ara: "Arabic",
  rus: "Russian",
  tha: "Thai",
  nld: "Dutch",
  ita: "Italian",
  por: "Portugese",
  spa: "Spanish",
  jpn: "Japanese",
  pol: "Polish",
  tur: "Turkish",
  heb: "Hebrew",
  vie: "Vietnamese",
  ind: "Indonesian",
  ces: "Czech",
  ukr: "Ukrainian",
  ell: "Greek",
  fas: "Farsi",
  hin: "Hindi",
  urd: "Urdu",
  swe: "Swedish",
  ben: "Bengali",
  msa: "Malay",
  ron: "Romanian"
} as const;

export const humanizeLanguage = (language: SummaryLanguage): string => {
  return codeToLanguageMap[language];
};

export const standardRerankerId = 272725717;
export const mmrRerankerId = 272725718;
