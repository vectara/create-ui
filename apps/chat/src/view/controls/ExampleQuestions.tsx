import { VuiGrid, VuiSpacer, VuiText, VuiTextColor } from "../../ui";
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
    <div className="exampleQuestionsContainer">
      <VuiText>
        <p>
          <VuiTextColor color="subdued">Try out these example questions</VuiTextColor>
        </p>
      </VuiText>

      <VuiSpacer size="m" />

      <VuiGrid columns={3}>
        {exampleQuestions.map((exampleQuestion) => (
          <ExampleQuestion
            key={exampleQuestion}
            onClick={() => onSubmitChat(exampleQuestion)}
            title={exampleQuestion}
          />
        ))}
      </VuiGrid>
    </div>
  );
};
