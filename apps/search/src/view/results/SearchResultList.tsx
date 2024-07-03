import { SearchResult } from "./SearchResult";
import { SearchResultWithSnippet } from "../types";

type Props = {
  results: Array<SearchResultWithSnippet>;
};

export const SearchResultList = ({ results }: Props) => {
  return (
    <>
      {results.map((result, i) => (
        <SearchResult key={i} result={result} position={i} />
      ))}
    </>
  );
};
