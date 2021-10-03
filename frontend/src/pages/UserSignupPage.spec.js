import React from "react";
import { render, cleanup, fireEvent, waitFor } from "@testing-library/react";
import { UserSignupPage } from "./UserSignupPage";

// after React-Testing_library version 9, this cleanup part is not needed anymore
beforeEach(cleanup);

describe("UserSignupPage", () => {
  describe("Layout", () => {
    // test or it
    it("has header of Sign Up", () => {
      // rendering component
      const { container } = render(<UserSignupPage />);
      const header = container.querySelector("h1");
      expect(header).toHaveTextContent("Sign Up");
    });

    it("has input for display name", () => {
      const { queryByPlaceholderText } = render(<UserSignupPage />);
      const displayNameInput = queryByPlaceholderText("Your display name");
      expect(displayNameInput).toBeInTheDocument();
    });

    it("has input for username", () => {
      const { queryByPlaceholderText } = render(<UserSignupPage />);
      const usernameInput = queryByPlaceholderText("Your username");
      expect(usernameInput).toBeInTheDocument();
    });

    it("has input for password", () => {
      const { queryByPlaceholderText } = render(<UserSignupPage />);
      const passwordInput = queryByPlaceholderText("Your password");
      expect(passwordInput).toBeInTheDocument();
    });

    it("has password type for password input", () => {
      const { queryByPlaceholderText } = render(<UserSignupPage />);
      const passwordInput = queryByPlaceholderText("Your password");
      expect(passwordInput.type).toBe("password");
    });

    it("has password type for password repeat", () => {
      const { queryByPlaceholderText } = render(<UserSignupPage />);
      const passwordRepeat = queryByPlaceholderText("Repeat your password");
      expect(passwordRepeat.type).toBe("password");
    });

    it("has password type for password repeat input", () => {
      const { queryByPlaceholderText } = render(<UserSignupPage />);
      const passwordRepeat = queryByPlaceholderText("Your password");
      expect(passwordRepeat.type).toBe("password");
    });

    it("has submit button", () => {
      const { container } = render(<UserSignupPage />);
      const button = container.querySelector("button");
      expect(button).toBeInTheDocument();
    });
  });

  // test groups
  describe("Interaction", () => {
    const changeEvent = (content) => {
      return {
        target: {
          value: content,
        },
      };
    };

    const mockAsyncDelayed = () => {
      return jest.fn().mockResolvedValueOnce(() => {
        return new Promise((resolve, reject) => {
          setTimeout(() => {
            resolve({});
          }, 300);
        });
      });
    };

    let button, displayNameInput, usernameInput, passwordInput, passwordRepeat;
    const setUpForSubmit = (props) => {
      const rendered = render(<UserSignupPage {...props} />);
      const { container, queryByPlaceholderText } = rendered;

      displayNameInput = queryByPlaceholderText("Your display name");
      usernameInput = queryByPlaceholderText("Your username");
      passwordInput = queryByPlaceholderText("Your password");
      passwordRepeat = queryByPlaceholderText("Repeat your password");

      fireEvent.change(displayNameInput, changeEvent("my-display-name"));
      fireEvent.change(usernameInput, changeEvent("my-user-name"));
      fireEvent.change(passwordInput, changeEvent("P4ssword"));
      fireEvent.change(passwordRepeat, changeEvent("P4ssword"));

      button = container.querySelector("button");

      return rendered;
    };

    it("sets the displayName value into state", () => {
      const { queryByPlaceholderText } = render(<UserSignupPage />);
      const displayNameInput = queryByPlaceholderText("Your display name");

      fireEvent.change(displayNameInput, changeEvent("my-display-name"));
      expect(displayNameInput).toHaveValue("my-display-name");
    });

    it("sets the userName value into state", () => {
      const { queryByPlaceholderText } = render(<UserSignupPage />);
      const displayNameInput = queryByPlaceholderText("Your username");

      fireEvent.change(displayNameInput, changeEvent("my-user-name"));
      expect(displayNameInput).toHaveValue("my-user-name");
    });

    it("sets the password value into state", () => {
      const { queryByPlaceholderText } = render(<UserSignupPage />);
      const passwordInput = queryByPlaceholderText("Your password");

      fireEvent.change(passwordInput, changeEvent("P4ssword"));
      expect(passwordInput).toHaveValue("P4ssword");
    });

    it("sets the password repeat value into state", () => {
      const { queryByPlaceholderText } = render(<UserSignupPage />);
      const passwordRepeat = queryByPlaceholderText("Repeat your password");

      fireEvent.change(passwordRepeat, changeEvent("P4ssword"));
      expect(passwordRepeat).toHaveValue("P4ssword");
    });

    it("calls postSignup when the fields are valid and the actions are provided in props", () => {
      // we are going to mock it
      const actions = {
        postSignup: jest.fn().mockResolvedValueOnce({}),
      };
      setUpForSubmit({ actions });

      fireEvent.click(button);
      expect(actions.postSignup).toHaveBeenCalledTimes(1);
    });

    it("does not throw exception when clicking the button when actions not provided in props ", () => {
      setUpForSubmit();
      expect(() => fireEvent.click(button)).not.toThrow();
    });

    it("calls post with user body when the fields are valid", () => {
      // we are going to mock it
      const actions = {
        postSignup: jest.fn().mockResolvedValueOnce({}),
      };
      setUpForSubmit({ actions });

      fireEvent.click(button);
      const expectedUserObject = {
        username: "my-user-name",
        displayName: "my-display-name",
        password: "P4ssword",
      };
      expect(actions.postSignup).toHaveBeenLastCalledWith(expectedUserObject);
    });

    // it is not efficient to write tests for styling because it may change more often than busines logic
    it("does not allow user to click the Sign Up button when there is an ongoing api call", () => {
      // we are going to mock it
      const actions = {
        postSignup: mockAsyncDelayed(),
      };
      setUpForSubmit({ actions });

      fireEvent.click(button);
      fireEvent.click(button);

      expect(actions.postSignup).toHaveBeenCalledTimes(1);
    });

    it("displays spinner when there is an ongoing api call", () => {
      // we are going to mock it
      const actions = {
        postSignup: mockAsyncDelayed(),
      };
      const { queryByText } = setUpForSubmit({ actions });
      fireEvent.click(button);
      const spinner = queryByText("Loading...");

      expect(spinner).toBeInTheDocument();
    });

    it("hides spinner after api call finishes successfully", async () => {
      // we are going to mock it
      const actions = {
        postSignup: mockAsyncDelayed(),
      };
      const { queryByText } = setUpForSubmit({ actions });
      fireEvent.click(button);

      const spinner = queryByText("Loading...");

      await waitFor(() => expect(spinner).not.toBeInTheDocument());
    });

    /// TO FIX!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
    it("hides spinner after api call finishes with error", async () => {
      // we are going to mock it
      const actions = {
        postSignup: jest.fn().mockResolvedValueOnce(() => {
          return new Promise((resolve, reject) => {
            setTimeout(() => {
              reject({
                response: { data: {} },
              });
            }, 300);
          });
        }),
      };
      const { queryByText } = setUpForSubmit({ actions });
      fireEvent.click(button);

      const spinner = queryByText("Loading...");

      await waitFor(() => expect(spinner).not.toBeInTheDocument());

      /// TO FIX!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
    });

    it("displays validation error for displayName when error is receivd for the field", async () => {
      const actions = {
        postSignup: jest.fn().mockRejectedValue({
          response: {
            data: {
              validationErrors: {
                displayName: "Cannot be null",
              },
            },
          },
        }),
      };

      const { findByText } = setUpForSubmit({ actions });
      fireEvent.click(button);

      // const errorMessage = await waitFor(() => queryByText("Cannot be null"));
      // console.log(errorMessage);
      const errorMessage = await findByText("Cannot be null");
      expect(errorMessage).toBeInTheDocument();
    });

    it("enables the signup button when password and repeat password have same value", () => {
      setUpForSubmit();
      expect(button).not.toBeDisabled();
    });

    it("disables the signup button when password and repeat password have different valus", () => {
      setUpForSubmit();
      fireEvent.change(passwordRepeat, changeEvent("new-pass"));
      expect(button).toBeDisabled();
    });

    it("disables the signup button when password does not match to password repeat", () => {
      setUpForSubmit();
      fireEvent.change(passwordInput, changeEvent("new-pass"));
      expect(button).toBeDisabled();
    });

    it("displays error style for password repeat input when password repeat mismatch", () => {
      const { queryByText } = setUpForSubmit();
      fireEvent.change(passwordRepeat, changeEvent("new-pass"));
      const mismatchWarning = queryByText("Does not match to password");
      expect(mismatchWarning).toBeInTheDocument();
    });

    it("display error style for password repeat input when password input mismatch", () => {
      const { queryByText } = setUpForSubmit();
      fireEvent.change(passwordInput, changeEvent("new-pass"));
      const mismatchWarning = queryByText("Does not match to password");
      expect(mismatchWarning).toBeInTheDocument();
    });

    it("hidden the validation error when user changes the content of displayName", async () => {
      const actions = {
        postSignup: jest.fn().mockRejectedValue({
          response: {
            data: {
              validationErrors: {
                displayName: "Cannot be null",
              },
            },
          },
        }),
      };

      const { findByText } = setUpForSubmit({ actions });
      fireEvent.click(button);

      // const errorMessage = await waitFor(() => queryByText("Cannot be null"));
      // console.log(errorMessage);
      const errorMessage = await findByText("Cannot be null");
      fireEvent.change(displayNameInput, changeEvent("name updated"));
      expect(errorMessage).not.toBeInTheDocument();
    });

    it("hidden the validation error when user changes the content of username", async () => {
      const actions = {
        postSignup: jest.fn().mockRejectedValue({
          response: {
            data: {
              validationErrors: {
                username: "Username cannot be null",
              },
            },
          },
        }),
      };

      const { findByText } = setUpForSubmit({ actions });
      fireEvent.click(button);

      // const errorMessage = await waitFor(() => queryByText("Cannot be null"));
      // console.log(errorMessage);
      const errorMessage = await findByText("Username cannot be null");
      fireEvent.change(usernameInput, changeEvent("name updated"));
      expect(errorMessage).not.toBeInTheDocument();
    });

    it("hidden the validation error when user changes the content of password", async () => {
      const actions = {
        postSignup: jest.fn().mockRejectedValue({
          response: {
            data: {
              validationErrors: {
                password: "Cannot be null",
              },
            },
          },
        }),
      };

      const { findByText } = setUpForSubmit({ actions });
      fireEvent.click(button);

      // const errorMessage = await waitFor(() => queryByText("Cannot be null"));
      // console.log(errorMessage);
      const errorMessage = await findByText("Cannot be null");
      fireEvent.change(passwordInput, changeEvent("password-updated"));
      expect(errorMessage).not.toBeInTheDocument();
    });

    it("redirects to homePage after succesful signup", async () => {
      // we are going to mock it
      const actions = {
        postSignup: jest.fn().mockResolvedValue({}),
      };
      const history = {
        push: jest.fn(),
      };

      setUpForSubmit({ actions, history });
      fireEvent.click(button);

      await waitFor(() => expect(history.push).toHaveBeenCalledWith("/"));
    });
  });
});
