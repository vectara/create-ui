import { useState } from "react";
import { BiSlider } from "react-icons/bi";
import { useSearchContext } from "../../contexts/SearchContext";
import {
  VuiButtonPrimary,
  VuiButtonSecondary,
  VuiButtonTertiary,
  VuiDrawer,
  VuiFlexContainer,
  VuiFlexItem,
  VuiHorizontalRule,
  VuiIcon,
  VuiLabel,
  VuiSearchSelect,
  VuiSpacer,
  VuiText,
  VuiTextColor,
  VuiTitle
} from "../../ui";
import { SUMMARY_LANGUAGES, SummaryLanguage, humanizeLanguage } from "../types";

const languageOptions = SUMMARY_LANGUAGES.map((code) => ({
  value: code,
  label: humanizeLanguage(code)
}));

type Props = {
  isOpen: boolean;
  onClose: () => void;
};

export const OptionsDrawer = ({ isOpen, onClose }: Props) => {
  const { language, onSearch } = useSearchContext();

  const [isLanguageMenuOpen, seIisLanguageMenuOpen] = useState(false);
  const [newLanguage, setNewLanguage] = useState<SummaryLanguage>(language);

  return (
    <VuiDrawer
      isOpen={isOpen}
      onClose={onClose}
      title={
        <VuiFlexContainer justifyContent="spaceBetween" alignItems="center" spacing="xs">
          <VuiFlexItem>
            <VuiIcon size="s">
              <BiSlider />
            </VuiIcon>
          </VuiFlexItem>

          <VuiFlexItem>
            <VuiTitle size="s">
              <h2>Options</h2>
            </VuiTitle>
          </VuiFlexItem>
        </VuiFlexContainer>
      }
    >
      <VuiLabel>Summary language</VuiLabel>

      <VuiSpacer size="xs" />

      <VuiText size="xs">
        <VuiTextColor color="subdued">
          <p>Summaries will be written in this language.</p>
        </VuiTextColor>
      </VuiText>

      <VuiSpacer size="xs" />

      <VuiSearchSelect
        isOpen={isLanguageMenuOpen}
        setIsOpen={seIisLanguageMenuOpen}
        onSelect={(value: string[]) => {
          setNewLanguage(value[0] as SummaryLanguage);
        }}
        selected={[newLanguage]}
        options={languageOptions}
        isMultiSelect={false}
      >
        <VuiButtonSecondary color="neutral" size="m">
          {humanizeLanguage(newLanguage)}
        </VuiButtonSecondary>
      </VuiSearchSelect>

      <VuiSpacer size="l" />

      <VuiHorizontalRule />

      <VuiSpacer size="m" />

      <VuiFlexContainer justifyContent="spaceBetween" alignItems="center">
        <VuiFlexItem grow={false} shrink={false}>
          <VuiButtonTertiary color="primary" onClick={() => onClose()}>
            Cancel
          </VuiButtonTertiary>
        </VuiFlexItem>

        <VuiFlexItem grow={false} shrink={false}>
          <VuiButtonPrimary
            color="primary"
            onClick={() => {
              if (newLanguage !== language) {
                onSearch({
                  language: newLanguage as SummaryLanguage
                });
              }

              onClose();
            }}
          >
            Save
          </VuiButtonPrimary>
        </VuiFlexItem>
      </VuiFlexContainer>
    </VuiDrawer>
  );
};
