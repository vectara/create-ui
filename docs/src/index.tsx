import ReactDOM from "react-dom";
import { Route, HashRouter, Routes } from "react-router-dom";
import { Home } from "./Home";
import "./ui/_index.scss";
import "./index.scss";

const App = () => {
  return (
    <HashRouter>
      <Routes>
        <Route path="/" element={<Home />} />
      </Routes>
    </HashRouter>
  );
};

ReactDOM.render(<App />, document.getElementById("root"));
