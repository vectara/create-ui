import { useConfigContext } from "../../contexts/ConfigurationContext";
import { VuiFlexContainer, VuiFlexItem } from "../../ui";
import { useSearchContext } from "../../contexts/SearchContext";
import { ExampleQuestion } from "./ExampleQuestion";
import "./exampleQuestions.scss";

export const ExampleQuestions = () => {
  const { exampleQuestions } = useConfigContext();
  const { onSearch } = useSearchContext();
  const hasExampleQuestions = exampleQuestions.length > 0;

  if (!hasExampleQuestions) return null;

  return (
    <VuiFlexContainer spacing="m" wrap className="promptList">
      {exampleQuestions.map((exampleQuestion) => (
        <VuiFlexItem grow={1} key={exampleQuestion}>
          <ExampleQuestion
            key={exampleQuestion}
            className="prompt"
            onClick={() => {
              onSearch({ value: exampleQuestion });
            }}
            title={exampleQuestion}
          />
        </VuiFlexItem>
      ))}
    </VuiFlexContainer>
  );
};
