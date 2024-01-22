import { ChangeEvent, FormEvent, useState } from "react";
import { BiSlider, BiTimeFive } from "react-icons/bi";
import {
  VuiFlexContainer,
  VuiFlexItem,
  VuiSearchInput,
  VuiSpacer,
  VuiTitle,
  VuiIcon,
  VuiButtonSecondary,
  VuiLink
} from "../../ui";
import { useConfigContext } from "../../contexts/ConfigurationContext";
import { useSearchContext } from "../../contexts/SearchContext";
import { HistoryDrawer } from "./HistoryDrawer";
import { OptionsDrawer } from "./OptionsDrawer";
import "./searchControls.scss";

type Props = {
  hasQuery: boolean;
};

export const SearchControls = ({ hasQuery }: Props) => {
  const { app } = useConfigContext();
  const { searchValue, setSearchValue, onSearch, reset } = useSearchContext();
  const [isOptionsOpen, setIsOptionsOpen] = useState(false);
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);

  const onSearchChange = (event: ChangeEvent<HTMLInputElement>) => {
    setSearchValue(event.target.value);
  };

  const onSearchSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    onSearch({ value: searchValue });
  };

  return (
    <>
      <div className="searchControls">
        <VuiFlexContainer alignItems="center" justifyContent="spaceBetween">
          <VuiFlexItem grow={false}>
            <VuiTitle size="m">
              <VuiLink href="/">
                <h2>
                  <strong>{app.title}</strong>
                </h2>
              </VuiLink>
            </VuiTitle>
          </VuiFlexItem>

          <VuiFlexItem grow={false}>
            <VuiFlexContainer alignItems="center" spacing="m">
              <VuiFlexItem grow={false}>
                <VuiButtonSecondary
                  color="neutral"
                  size="s"
                  isSelected={isOptionsOpen}
                  onClick={() => setIsOptionsOpen(!isOptionsOpen)}
                  icon={
                    <VuiIcon size="m">
                      <BiSlider />
                    </VuiIcon>
                  }
                >
                  Options
                </VuiButtonSecondary>
              </VuiFlexItem>

              <VuiFlexItem grow={false}>
                <VuiButtonSecondary
                  color="neutral"
                  size="s"
                  isSelected={isHistoryOpen}
                  onClick={() => setIsHistoryOpen(!isHistoryOpen)}
                  icon={
                    <VuiIcon size="m">
                      <BiTimeFive />
                    </VuiIcon>
                  }
                >
                  History
                </VuiButtonSecondary>
              </VuiFlexItem>
            </VuiFlexContainer>
          </VuiFlexItem>
        </VuiFlexContainer>

        <VuiSpacer size="m" />

        <VuiSearchInput
          size="l"
          value={searchValue}
          onChange={onSearchChange}
          onSubmit={onSearchSubmit}
          placeholder="Ask a question"
          autoFocus
        />

        <VuiSpacer size="m" />

        {hasQuery && (
          <VuiButtonSecondary color="neutral" size="s" onClick={() => reset()}>
            Start over
          </VuiButtonSecondary>
        )}
      </div>

      <HistoryDrawer isOpen={isHistoryOpen} onClose={() => setIsHistoryOpen(false)} />

      <OptionsDrawer isOpen={isOptionsOpen} onClose={() => setIsOptionsOpen(false)} />
    </>
  );
};
