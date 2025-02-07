import React from 'react';
import { VuiSelect } from '../ui';
import { SummaryLanguage, SUMMARY_LANGUAGES, humanizeLanguage } from '../view/types';

interface Props {
  value: SummaryLanguage;
  onChange: (lang: SummaryLanguage) => void;
  className?: string;
}

export const LanguageSelector: React.FC<Props> = ({ value, onChange, className }) => {
  const options = SUMMARY_LANGUAGES.map(lang => ({
    value: lang,
    text: humanizeLanguage(lang)
  }));

  return (
    <VuiSelect
      value={value}
      onChange={e => onChange(e.target.value as SummaryLanguage)}
      options={options}
      className={className}
      aria-label="Select language"
    />
  );
};
