import { extractCitations } from "../../ui/utils/citations";
import { VuiText } from "../../ui";

type Props = {
  summary?: string;
};

const decorateSummary = (summary: string) => {
  const citations = extractCitations(summary);
  return citations.reduce((accum, { text, references }, index) => {
    if (references) {
      accum.push(<span key={`text${index}`}>{text}</span>);

      const marginBefore = text ? text[text.length - 1] !== " " : false;
      if (marginBefore) {
        accum.push(<span key={`spaceBefore${index}`}> </span>);
      }

      references.forEach((reference, referenceIndex) => {
        if (referenceIndex > 0) {
          accum.push(<span key={`spaceInner${index}-${referenceIndex}`}> </span>);
        }

        accum.push(
          <span className="summaryCitation" key={`citation${index}-${referenceIndex}`}>
            {reference}
          </span>
        );

        const followingCitation = citations[index + 1];
        const marginAfter = ![",", ".", "!", "?", ":", ";"].includes(followingCitation?.text?.[0]);
        if (marginAfter) {
          const position = parseInt(reference, 10);
          accum.push(<span key={`spaceAfter${position}`}> </span>);
        }
      });
    } else {
      accum.push(<span key={`text${text}${index}`}>{text}</span>);
    }
    return accum;
  }, [] as JSX.Element[]);
};

export const Summary = ({ summary }: Props) => {
  let content;
  if (summary) {
    content = decorateSummary(summary);
  }

  return (
    <VuiText>
      <p>{content}</p>
    </VuiText>
  );
};
