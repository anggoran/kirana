import React from "react";
import ReactDOM from "react-dom";
import Home from "./views/pages/index";
import { ThemeProvider } from "@primer/react";

ReactDOM.render(
  <React.StrictMode>
    <ThemeProvider>
      <Home />
    </ThemeProvider>
  </React.StrictMode>,
  document.getElementById("root")
);
