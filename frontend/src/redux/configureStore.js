import { createStore, applyMiddleware } from "redux";
// import UserSignupPage from "./pages/UserSignupPage";
// import LoginPage from "./pages/LoginPage";
import authReducer from "./authReducer";
import logger from "redux-logger";

import thunk from "redux-thunk";

const configureStore = (addLogger = true) => {
  const middleware = addLogger
    ? applyMiddleware(thunk, logger)
    : applyMiddleware(thunk);

  return createStore(authReducer, middleware);
};

export default configureStore;
