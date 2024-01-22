import { BiLogoGithub } from "react-icons/bi";
import { VuiFlexContainer, VuiFlexItem, VuiTitle, VuiIconButton, VuiIcon, VuiAppHeader } from "../../ui";
import { HeaderLogo } from "./HeaderLogo";

export const AppHeader = () => {
  return (
    <VuiAppHeader
      left={
        <VuiFlexContainer spacing="m" alignItems="center">
          <VuiFlexItem grow={false} shrink={false}>
            <HeaderLogo />
          </VuiFlexItem>

          <VuiFlexItem grow={false} shrink={false}>
            <VuiTitle size="xs">
              <h1>
                <strong>
                  <a href="https://vectara.github.io/create-ui">Vectara Create-UI</a>
                </strong>
              </h1>
            </VuiTitle>
          </VuiFlexItem>
        </VuiFlexContainer>
      }
      right={
        <VuiIconButton
          href="https://github.com/vectara/create-ui"
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
  );
};
