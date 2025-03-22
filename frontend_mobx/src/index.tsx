import React from "react";
import ReactDOM from "react-dom/client";
import { Provider } from "mobx-react";
import App from "./App";
import { authStore } from "./stores/authStore";
import { clientStore } from "./stores/clientStore";
import "./index.css";

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <Provider authStore={authStore} clientStore={clientStore}>
    <App />
  </Provider>
);