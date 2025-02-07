import { BrowserRouter as Router } from "react-router-dom";
import { ChatView } from "./view/ChatView";
import { useConfigContext } from "./contexts/ConfigurationContext";
import { SearchContextProvider } from "./contexts/SearchContext";
import { ConfigContextProvider } from "./contexts/ConfigurationContext";
import "./App.scss";
import { ChatContextProvider } from "./contexts/ChatContext";

const AppRoutes = () => {
  const { app } = useConfigContext();
  document.title = app.title ?? "Vectara Chat";

  return (
    <Router>
      <SearchContextProvider>
        <ChatContextProvider>
          <ChatView />
        </ChatContextProvider>
      </SearchContextProvider>
    </Router>
  );
};

export const App = () => (
  <ConfigContextProvider>
    <AppRoutes />
  </ConfigContextProvider>
);
