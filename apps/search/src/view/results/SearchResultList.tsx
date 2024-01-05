import { SearchResult } from "./SearchResult";
import { DeserializedSearchResult } from "../types";

type Props = {
  results: Array<DeserializedSearchResult>;
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
