import React from "react";
import { render } from "@testing-library/react";
import HomePage from "./HomePage";

import * as apiCalls from "../api/apiCalls";

// redux - the same like in normal app
import { Provider } from "react-redux";
import { createStore } from "redux";
import authReducer from "../redux/authReducer";

const defaultState = {
  id: 1,
  username: "user1",
  displayName: "display1",
  image: "profile1.png",
  password: "P4ssword",
  isLoggedIn: true,
};

// when we are testing Links out of router we have to mock router because
// if not we are going to have errors regarding this
let store;
const setup = (state = defaultState) => {
  store = createStore(authReducer, state);
  return render(
    <Provider store={store}>
      <HomePage />
    </Provider>
  );
};

apiCalls.listUsers = jest.fn().mockResolvedValue({
  data: {
    content: [],
    number: 0,
    size: 3,
  },
});

describe("Home Page", () => {
  describe("Laout", () => {
    it("has root page div", () => {
      // adding this type of data-testid and adding test reated code is not good practise
      // but it is the only solution for start
      const { queryByTestId } = setup();
      const homePageDiv = queryByTestId("homepage");
      expect(homePageDiv).toBeInTheDocument();
    });
  });
});
