import { SearchResult } from "./SearchResult";
import { SearchResultWithSnippet } from "../types";

type Props = {
  results: Array<SearchResultWithSnippet>;
  selectedSearchResultPosition?: number;
  setSearchResultRef: (el: HTMLDivElement | null, index: number) => void;
};

export const SearchResultList = ({ results, selectedSearchResultPosition, setSearchResultRef }: Props) => {
  return (
    <>
      {results.map((result, i) => (
        <SearchResult
          key={i}
          result={result}
          position={i}
          isSelected={selectedSearchResultPosition === i}
          ref={(el: HTMLDivElement | null) => setSearchResultRef(el, i)}
        />
      ))}
    </>
  );
};
