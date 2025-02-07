import { ChangeEvent, FormEvent } from "react";
import { VuiButtonPrimary, VuiFlexContainer, VuiFlexItem, VuiSearchInput } from "../../ui";

type Props = {
  query: string;
  setQuery: (query: string) => void;
  search: () => void;
  placeholder: string;
  buttonLabel: string;
  isDisabled?: boolean;
};

export const QueryInput = ({ query, setQuery, search, placeholder, buttonLabel, isDisabled }: Props) => {
  const onSearchChange = (e: ChangeEvent<HTMLInputElement>) => {
    setQuery(e.target.value);
  };

  const onSearchSubmit = (e: FormEvent) => {
    e.preventDefault();
    search();
  };

  return (
    <VuiFlexContainer alignItems="center">
      <VuiFlexItem grow={1}>
        <VuiSearchInput
          size="l"
          value={query}
          onChange={onSearchChange}
          onSubmit={onSearchSubmit}
          placeholder={placeholder}
          autoFocus
          data-testid="corpusSearchInput"
        />
      </VuiFlexItem>

      <VuiFlexItem>
        <VuiButtonPrimary color="primary" size="l" onClick={() => search()} isDisabled={isDisabled}>
          {buttonLabel}
        </VuiButtonPrimary>
      </VuiFlexItem>
    </VuiFlexContainer>
  );
};
