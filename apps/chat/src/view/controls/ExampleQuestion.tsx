import { VuiSpacer, VuiTextColor, VuiTitle, VuiTopicButton } from "../../ui";

type Props = {
  children?: React.ReactNode;
  onClick: () => void;
  title?: string;
};

export const ExampleQuestion = ({ children, onClick, title }: Props) => {
  const content = (
    <>
      {title && (
        <>
          <VuiTitle size="s">
            <p>
              <VuiTextColor color="primary">{title}</VuiTextColor>
            </p>
          </VuiTitle>

          {children && <VuiSpacer size="xxs" />}
        </>
      )}

      {children}
    </>
  );

  return <VuiTopicButton onClick={onClick}>{content}</VuiTopicButton>;
};
