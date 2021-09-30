// in testing we are going to change the bahaving of axios

import axios from "axios";
import * as apiCalls from "./apiCalls";

describe("apiCalls", () => {
  describe("signup", () => {
    it("calls /api/1.0/users", () => {
      const mockSignup = jest.fn();
      // we are replacing the function post in axios to check how and when we use it
      axios.post = mockSignup;
      apiCalls.signup();

      //jest is providing us to access to mock call history
      const path = mockSignup.mock.calls[0][0];
      expect(path).toBe("/api/1.0/users");
    });
  });
  describe("login", () => {
    it("calls /api/1.0/login", () => {
      const mockLogin = jest.fn();
      axios.post = mockLogin;
      apiCalls.login({ username: "test-user", password: "P4ssword" });
      const path = mockLogin.mock.calls[0][0];
      expect(path).toBe("/api/1.0/login");
    });
  });
});
