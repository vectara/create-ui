import { BiLogoGithub } from "react-icons/bi";
import {
  VuiAppContent,
  VuiAppHeader,
  VuiAppLayout,
  VuiFlexContainer,
  VuiFlexItem,
  VuiIcon,
  VuiIconButton,
  VuiTitle,
  VuiSpacer,
  VuiText,
  VuiLink,
  VuiCode
} from "./ui";
import { HeaderLogo } from "components/HeaderLogo";

const DemoTitle = ({ title, href }: { title: string; href: string }) => (
  <VuiFlexContainer alignItems="end" justifyContent="spaceBetween" className="demoTitle">
    <VuiFlexItem>
      <VuiTitle size="m">
        <h2>{title}</h2>
      </VuiTitle>
    </VuiFlexItem>

    <VuiFlexItem>
      <VuiText>
        <p>
          <VuiLink isAnchor href={href}>
            See demo →
          </VuiLink>
        </p>
      </VuiText>
    </VuiFlexItem>
  </VuiFlexContainer>
);

const DemoImage = ({ href, src, alt }: { href: string; src: string; alt: string }) => (
  <VuiFlexContainer alignItems="start" justifyContent="center" direction="column">
    <VuiLink isAnchor href={href}>
      <img alt={alt} className="demoImage" src={src} />
    </VuiLink>
  </VuiFlexContainer>
);

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
                  <strong>
                    <VuiLink isAnchor href="https://vectara.github.io/create-ui">
                      Vectara Create-UI
                    </VuiLink>
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
      <VuiAppLayout>
        <VuiAppContent className="appExampleContent" padding="xl">
          <div className="content">
            <VuiTitle size="l">
              <h1>Vectara Create-UI</h1>
            </VuiTitle>

            <VuiSpacer size="m" />

            <VuiText>
              <p>
                Create-UI is the fastest way to generate a{" "}
                <VuiLink isAnchor href="https://vectara.com/">
                  Vectara
                </VuiLink>
                -powered sample codebase for a range of user interfaces.
              </p>
            </VuiText>

            <VuiSpacer size="m" />

            <VuiText>
              <p>
                Create the UIs below with a single command. Requires{" "}
                <VuiLink isAnchor href="https://nodejs.org/en/download">
                  Node and NPM
                </VuiLink>
                . For more info,{" "}
                <VuiLink isAnchor href="https://github.com/vectara/create-ui">
                  read the docs.
                </VuiLink>
              </p>
            </VuiText>

            <VuiSpacer size="m" />

            <VuiCode>npx @vectara/create-ui</VuiCode>

            <VuiSpacer size="xl" />

            <DemoTitle title="Semantic Search UI" href="./searchDemo" />
            <DemoImage href="./searchDemo" src="./images/demoSearch.jpg" alt="Screenshot of Semantic Search UI" />

            <VuiSpacer size="xl" />

            <DemoTitle title="Summarized Semantic Search UI" href="./searchSummaryDemo" />
            <DemoImage
              href="./searchSummaryDemo"
              src="./images/demoSearchSummary.jpg"
              alt="Screenshot of Summarized Semantic Search UI"
            />

            <VuiSpacer size="xl" />

            <DemoTitle title="Question and Answer UI" href="./questionAndAnswerDemo" />
            <DemoImage
              href="./questionAndAnswerDemo"
              src="./images/demoQuestionAndAnswer.jpg"
              alt="Screenshot of Question and Answer UI"
            />

            <VuiSpacer size="xxl" />
          </div>
        </VuiAppContent>
      </VuiAppLayout>
    </>
  );
};
