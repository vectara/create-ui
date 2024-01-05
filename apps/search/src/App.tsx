import { BrowserRouter as Router } from "react-router-dom";
import { SearchView } from "./view/SearchView";
import { SearchContextProvider } from "./contexts/SearchContext";
import { useConfigContext, ConfigContextProvider } from "./contexts/ConfigurationContext";
import "./App.scss";

const AppRoutes = () => {
  const { app } = useConfigContext();
  document.title = app.title ?? "Vectara Search";

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
