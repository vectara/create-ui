import { VuiBadge } from "../../ui";

type ConfidenceLevel = "unavailable" | "low" | "medium" | "high";

const confidenceLevelToColor = {
  unavailable: "neutral",
  low: "danger",
  medium: "warning",
  high: "success"
} as const;

type Props = { fcs?: number };

export const ConfidenceBadge = ({ fcs }: Props) => {
  const confidenceLevel: ConfidenceLevel =
    fcs === undefined ? "unavailable" : fcs < 0.333 ? "low" : fcs < 0.666 ? "medium" : "high";
  return (
    <VuiBadge color={confidenceLevelToColor[confidenceLevel]}>
      Factual Consistency Score: {fcs ? `${Math.round(fcs * 100)}%` : "Unavailable"}
    </VuiBadge>
  );
};
