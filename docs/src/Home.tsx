import { BiLogoGithub } from "react-icons/bi";
import {
  VuiAppContent,
  VuiAppHeader,
  VuiAppLayout,
  VuiFlexContainer,
  VuiFlexItem,
  VuiIcon,
  VuiIconButton,
  VuiTitle
} from "./ui";
import { HeaderLogo } from "components/HeaderLogo";

export const Home = () => {
  return (
    <>
      <VuiAppHeader
        left={
          <VuiFlexContainer spacing="m" alignItems="center">
            <VuiFlexItem grow={false} shrink={false}>
              <HeaderLogo />
            </VuiFlexItem>

            <VuiFlexItem grow={false} shrink={false}>
              <VuiTitle size="xs">
                <h1>
                  <strong>Vectara Create-UI</strong>
                </h1>
              </VuiTitle>
            </VuiFlexItem>
          </VuiFlexContainer>
        }
        right={
          <VuiIconButton
            href="https://github.com/vectara/react-search"
            target="_blank"
            color="neutral"
            size="l"
            icon={
              <VuiIcon>
                <BiLogoGithub />
              </VuiIcon>
            }
          />
        }
      />
      <VuiAppLayout>
        <VuiAppContent className="appExampleContent" padding="xl">
          <div className="content">
            <p>Here are examples of what you get out of the box with Vectara Create-UI.</p>

            <p>Semantic search (screenshot, link, description)</p>

            <p>Summarized semantic search (screenshot, link, description)</p>

            <p>Question and answer (screenshot, link, description)</p>
          </div>
        </VuiAppContent>
      </VuiAppLayout>
    </>
  );
};
