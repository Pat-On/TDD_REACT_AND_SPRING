import { createStore, applyMiddleware } from "redux";
// import UserSignupPage from "./pages/UserSignupPage";
// import LoginPage from "./pages/LoginPage";
import authReducer from "./authReducer";
import logger from "redux-logger";

import thunk from "redux-thunk";

const configureStore = (addLogger = true) => {
  let localStorageData = localStorage.getItem("hoax-auth");
  let persistedState = {
    id: 0,
    username: "",
    displayName: "",
    image: "",
    password: "",
    isLoggedIn: false,
  };

  if (localStorageData) {
    try {
      persistedState = JSON.parse(localStorageData);
    } catch (err) {}
  }

  const middleware = addLogger
    ? applyMiddleware(thunk, logger)
    : applyMiddleware(thunk);

  const store = createStore(authReducer, persistedState, middleware);

  // this will always run when something is going to change in our store
  store.subscribe(() => {
    localStorage.setItem("hoax-auth", JSON.stringify(store.getState()));
  });
  return store;
};

export default configureStore;
