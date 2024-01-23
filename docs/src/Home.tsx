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
      <VuiAppLayout>
        <VuiAppContent className="appExampleContent" padding="xl">
          <div className="content">
            <VuiTitle size="l">
              <h1>Vectara Create-UI</h1>
            </VuiTitle>

            <VuiSpacer size="m" />

            <VuiText>
              <p>
                Create-UI is the fastest way to generate a <a href="https://vectara.com/">Vectara</a>-powered sample
                codebase for a range of user interfaces.
              </p>
            </VuiText>

            <VuiSpacer size="m" />

            <VuiText>
              <p>
                Create the UIs below with a single command. Requires{" "}
                <a href="https://nodejs.org/en/download">Node and NPM</a>. For more info,{" "}
                <a href="https://github.com/vectara/create-ui">read the docs.</a>
              </p>
            </VuiText>

            <VuiSpacer size="m" />

            <VuiCode>npx @vectara/create-ui</VuiCode>

            <VuiSpacer size="xl" />

            <VuiFlexContainer alignItems="end" justifyContent="spaceBetween">
              <VuiFlexItem>
                <VuiTitle size="m">
                  <h2>Semantic Search UI</h2>
                </VuiTitle>
              </VuiFlexItem>

              <VuiFlexItem>
                <VuiText>
                  <p>
                    <a href="./searchDemo">See demo →</a>
                  </p>
                </VuiText>
              </VuiFlexItem>
            </VuiFlexContainer>

            <VuiSpacer size="l" />

            <a href="./searchDemo">
              <img alt="Screenshot of Semantic Search UI" className="demoImage" src="./images/demoSearch.jpg" />
            </a>

            <VuiSpacer size="m" />

            <VuiText>
              <p>The Semantic Search UI is characterized by: </p>
              <ul>
                <li>
                  A search box for entering a natural-language query. This can take the form of a question or just
                  search terms.
                </li>
                <li>A list of search results.</li>
              </ul>
              <p>
                A user will typically scan the list for relevant results and dig deeper into any results that look
                interesting. They'll try variations on the same basic query to make sure they find as many potentially
                useful results as possible.
              </p>
            </VuiText>

            <VuiSpacer size="xl" />

            <VuiFlexContainer alignItems="end" justifyContent="spaceBetween">
              <VuiFlexItem>
                <VuiTitle size="m">
                  <h2>Summarized Semantic Search UI</h2>
                </VuiTitle>
              </VuiFlexItem>

              <VuiFlexItem>
                <VuiText>
                  <p>
                    <a href="./searchSummaryDemo">See demo →</a>
                  </p>
                </VuiText>
              </VuiFlexItem>
            </VuiFlexContainer>

            <VuiSpacer size="l" />

            <a href="./searchSummaryDemo">
              <img
                className="demoImage"
                alt="Screenshot of Summarized Semantic Search UI"
                src="./images/demoSearchSummary.jpg"
              />
            </a>

            <VuiSpacer size="m" />

            <VuiText>
              <p>The Summarized Semantic UI is characterized by:</p>
              <ul>
                <li>
                  A search box for entering a natural-language query. This can take the form of a question or just
                  search terms.
                </li>
                <li>A list of search results.</li>
                <li>A summary of search results that are most relevant to the query, with citations.</li>
              </ul>
              <p>
                A user will typically scan the summary for points of interest, which is faster than reviewing the list
                of search results. If an aspect of the summary catches their eye, they'll dig deeper into the cited
                search result. They'll repeat this pattern until they've reviewed all of the interesting information
                that was relevant to their query.
              </p>
            </VuiText>

            <VuiSpacer size="xl" />

            <VuiFlexContainer alignItems="end" justifyContent="spaceBetween">
              <VuiFlexItem>
                <VuiTitle size="m">
                  <h2>Question and Answer UI</h2>
                </VuiTitle>
              </VuiFlexItem>

              <VuiFlexItem>
                <VuiText>
                  <p>
                    <a href="./questionAndAnswerDemo">See demo →</a>
                  </p>
                </VuiText>
              </VuiFlexItem>
            </VuiFlexContainer>

            <VuiSpacer size="l" />

            <a href="./questionAndAnswerDemo">
              <img
                className="demoImage"
                alt="Screenshot of Question and Answer UI"
                src="./images/demoQuestionAndAnswer.jpg"
              />
            </a>

            <VuiSpacer size="m" />

            <VuiText>
              <p>The Question and Answer UI is characterized by:</p>
              <ul>
                <li>
                  A search box for entering a natural-language query. This typically takes the form of a question.
                </li>
                <li>A condensed answer based upon the most relevant search results, with citations.</li>
              </ul>
              <p>
                A user will typically scan the answer to see if it truly answers their question. They'll use the
                citations to verify that the answer is grounded in facts. If the answer doesn't fully answer their
                question they'll try again with a differently-worded question.
              </p>
            </VuiText>

            <VuiSpacer size="xxl" />
          </div>
        </VuiAppContent>
      </VuiAppLayout>
    </>
  );
};
