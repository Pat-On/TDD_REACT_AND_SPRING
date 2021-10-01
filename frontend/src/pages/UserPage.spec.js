import React from "react";
import { render } from "@testing-library/react";
import UserPage from "./UserPage";

describe("UserPAge", () => {
  describe("Laout", () => {
    it("has root page div", () => {
      // adding this type of data-testid and adding test reated code is not good practise
      // but it is the only solution for start
      const { queryByTestId } = render(<UserPage />);
      const userPageDiv = queryByTestId("userpage");
      expect(userPageDiv).toBeInTheDocument();
    });
  });
});
