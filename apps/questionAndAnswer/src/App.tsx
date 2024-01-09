import { BrowserRouter as Router } from "react-router-dom";
import { SearchView } from "./view/SearchView";
import { useConfigContext } from "./contexts/ConfigurationContext";
import { SearchContextProvider } from "./contexts/SearchContext";
import { ConfigContextProvider } from "./contexts/ConfigurationContext";
import "./App.scss";

const AppRoutes = () => {
  const { app } = useConfigContext();
  document.title = app.title ?? "Vectara Q&A";

  return (
    <Router>
      <SearchContextProvider>
        <SearchView />
      </SearchContextProvider>
    </Router>
  );
};

export const App = () => (
  <ConfigContextProvider>
    <AppRoutes />
  </ConfigContextProvider>
);
