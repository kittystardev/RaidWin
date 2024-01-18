import React from "react";
import ReactDOM from "react-dom/client";
import "./index.scss";
import App from "./App";
import { Provider } from "react-redux";
import store from "./store/configStore";
import { WalletProvider } from "./WalletContext";

const root = ReactDOM.createRoot(document.getElementById("root"));

root.render(
  <Provider store={store}>
    <WalletProvider>
      <App />
    </WalletProvider>
  </Provider>
);
