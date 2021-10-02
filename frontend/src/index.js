import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import App from "./containers/App";
import reportWebVitals from "./reportWebVitals";
import { HashRouter } from "react-router-dom"; // he chose it because of the reason how is backend working
import { Provider } from "react-redux";
import { createStore } from "redux";
// import UserSignupPage from "./pages/UserSignupPage";
// import LoginPage from "./pages/LoginPage";
import authReducer from "./redux/authReducer";

const store = createStore(authReducer);

ReactDOM.render(
  <Provider store={store}>
    <HashRouter>
      <App />
    </HashRouter>
  </Provider>,
  document.getElementById("root")
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
