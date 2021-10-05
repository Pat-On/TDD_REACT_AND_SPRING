import React from "react";
import { render, waitFor } from "@testing-library/react";
import UserPage from "./UserPage";
import * as apiCalls from "../api/apiCalls";

const mockSuccessGetUser = {
  data: {
    id: 1,
    username: "user1",
    displayName: "display1",
    image: "profile1.png",
  },
};

const mockFailGetUser = {
  response: {
    data: {
      message: "User not found",
    },
  },
};

const match = {
  params: {
    username: "user1",
  },
};

const setup = (props) => {
  return render(<UserPage {...props} />);
};

describe("UserPAge", () => {
  describe("Laout", () => {
    it("has root page div", () => {
      // adding this type of data-testid and adding test reated code is not good practise
      // but it is the only solution for start
      const { queryByTestId } = setup();
      const userPageDiv = queryByTestId("userpage");
      expect(userPageDiv).toBeInTheDocument();
    });

    it("displays the displayName@username when user data loaded", async () => {
      apiCalls.getUser = jest.fn().mockResolvedValue(mockSuccessGetUser);
      const { findByText } = setup({ match });
      const text = await findByText("display1@user1");

      expect(text).toBeInTheDocument();
    });

    it("displays not found alert when user not found", async () => {
      apiCalls.getUser = jest.fn().mockRejectedValue(mockFailGetUser);
      const { findByText } = setup({ match });
      const text = await findByText("User not found");

      expect(text).toBeInTheDocument();
    });
  });

  describe("Lifecycle", () => {
    it("calls getUser when it is rendered", () => {
      apiCalls.getUser = jest.fn().mockResolvedValue(mockSuccessGetUser);
      setup({ match });
      expect(apiCalls.getUser).toHaveBeenCalledTimes(1);
    });

    it("calls getUser for user1 when it is rendered with user1 in match", () => {
      apiCalls.getUser = jest.fn().mockResolvedValue(mockSuccessGetUser);
      setup({ match });
      expect(apiCalls.getUser).toHaveBeenLastCalledWith("user1");
    });
  });
});
