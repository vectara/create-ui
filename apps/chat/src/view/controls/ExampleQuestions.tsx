import { VuiGrid } from "../../ui";
import { useConfigContext } from "../../contexts/ConfigurationContext";
import { useChatContext } from "../../contexts/ChatContext";
import { ExampleQuestion } from "./ExampleQuestion";
import "./exampleQuestions.scss";

export const ExampleQuestions = () => {
  const { exampleQuestions } = useConfigContext();
  const { onSubmitChat } = useChatContext();
  const hasExampleQuestions = exampleQuestions.length > 0;

  if (!hasExampleQuestions) return null;

  return (
    <VuiGrid columns={3}>
      {exampleQuestions.map((exampleQuestion) => (
        <ExampleQuestion key={exampleQuestion} onClick={() => onSubmitChat(exampleQuestion)} title={exampleQuestion} />
      ))}
    </VuiGrid>
  );
};
