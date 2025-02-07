import { VuiFlexContainer, VuiFlexItem, VuiTitle, VuiAppHeader } from "../../ui";
import { HeaderLogo } from "./HeaderLogo";
import { useConfigContext } from "../../contexts/ConfigurationContext";

export const AppHeader = () => {
  const { app } = useConfigContext();
  
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
                <strong>{app.title || "K-pop Search"}</strong>
              </h1>
            </VuiTitle>
          </VuiFlexItem>
        </VuiFlexContainer>
      }
    />
  );
};
