import React from "react";
import { render } from "@testing-library/react";
import HomePage from "./HomePage";

import * as apiCalls from "../api/apiCalls";

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
      const { queryByTestId } = render(<HomePage />);
      const homePageDiv = queryByTestId("homepage");
      expect(homePageDiv).toBeInTheDocument();
    });
  });
});
