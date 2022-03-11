import { BrowserRouter as Router } from 'react-router-dom';
import React from "react";
import ReactDOM from "react-dom";

import App from "./App";
import "./index.css";

const rootElement = document.getElementById("root");
ReactDOM.render(
  <React.StrictMode>
    <Router basename={process.env.PUBLIC_URL}>
      <App />
    </Router>
  </React.StrictMode>,
  rootElement
);
