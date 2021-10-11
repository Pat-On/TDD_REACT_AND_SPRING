import React from "react";
import {
  render,
  fireEvent,
  waitFor,
  findByText,
  waitForElementToBeRemoved,
} from "@testing-library/react";
import { LoginPage } from "./LoginPage";

describe("LoginPage", () => {
  describe("Layout", () => {
    it("has header of Login", () => {
      const { container } = render(<LoginPage />);
      const header = container.querySelector("h1");
      expect(header).toHaveTextContent("Login");
    });

    it("has input for username", () => {
      const { queryByPlaceholderText } = render(<LoginPage />);
      const usernameInput = queryByPlaceholderText("Your username");
      expect(usernameInput).toBeInTheDocument();
    });

    it("has input for passwod", () => {
      const { queryByPlaceholderText } = render(<LoginPage />);
      const passwordInput = queryByPlaceholderText("Your password");
      expect(passwordInput).toBeInTheDocument();
    });

    it("has password type for password input", () => {
      const { queryByPlaceholderText } = render(<LoginPage />);
      const passwordInput = queryByPlaceholderText("Your password");
      expect(passwordInput.type).toBe("password");
    });

    it("has login button", () => {
      const { container } = render(<LoginPage />);
      const button = container.querySelector("button");
      expect(button).toBeInTheDocument();
    });
  });

  describe("Intercations", () => {
    const changeEvent = (content) => {
      return {
        target: {
          value: content,
        },
      };
    };
    const history = {
      push: jest.fn(),
    };
    const actions = {
      postLogin: jest.fn().mockResolvedValue({}),
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

    let usernameInput, passwordInput, button;
    const setUpForSubmit = (props) => {
      const rendered = render(<LoginPage {...props} />);

      const { container, queryByPlaceholderText } = rendered;
      usernameInput = queryByPlaceholderText("Your username");
      fireEvent.change(usernameInput, changeEvent("my-user-name"));
      passwordInput = queryByPlaceholderText("Your password");
      fireEvent.change(passwordInput, changeEvent("P4ssword"));
      button = container.querySelector("button");

      return rendered;
    };

    // this two tests bellow have no sense in my opinion
    it("sets the username value into state", () => {
      const { queryByPlaceholderText } = render(<LoginPage />);
      const usernameInput = queryByPlaceholderText("Your username");
      fireEvent.change(usernameInput, changeEvent("my-user-name"));
      expect(usernameInput).toHaveValue("my-user-name");
    });

    it("sets the password value into state", () => {
      const { queryByPlaceholderText } = render(<LoginPage />);
      const passwordInput = queryByPlaceholderText("Your username");
      fireEvent.change(passwordInput, changeEvent("P4ssword"));
      expect(passwordInput).toHaveValue("P4ssword");
    });

    it("calss postLogin when the actions are provided in props and input fields have values", () => {
      const actions = {
        postLogin: jest.fn().mockResolvedValue({}),
      };
      setUpForSubmit({ actions, history });
      fireEvent.click(button);
      expect(actions.postLogin).toHaveBeenCalledTimes(1);
    });

    it("does not throw exception when clicking the button when actions not provided in props", () => {
      setUpForSubmit({ actions, history });
      expect(() => fireEvent.click(button)).not.toThrow();
    });

    it("calss postLogin with credentials in body", () => {
      const actions = {
        postLogin: jest.fn().mockResolvedValue({}),
      };

      setUpForSubmit({ actions, history });
      fireEvent.click(button);

      const expectedUserObject = {
        username: "my-user-name",
        password: "P4ssword",
      };

      expect(actions.postLogin).toHaveBeenCalledWith(expectedUserObject);
    });

    it("enables the button when username and password is not empty", () => {
      const actions = {
        postLogin: jest.fn().mockResolvedValue({}),
      };
      setUpForSubmit({ actions, history });
      expect(button).not.toBeDisabled();
    });

    it("disables the button when username  is empty", () => {
      setUpForSubmit({ actions, history });
      fireEvent.change(usernameInput, changeEvent(""));
      expect(button).toBeDisabled();
    });

    it("disables the button when  password is empty", () => {
      setUpForSubmit({ actions, history });
      fireEvent.change(passwordInput, changeEvent(""));
      expect(button).toBeDisabled();
    });

    it("displays alert when login fails", async () => {
      const actions = {
        postLogin: jest.fn().mockRejectedValue({
          response: {
            data: {
              message: "Login failed",
            },
          },
        }),
      };
      const history = {
        push: jest.fn(),
      };
      const { findByText } = setUpForSubmit({ actions, history });
      fireEvent.click(button);

      const alert = await findByText("Login failed");
      expect(alert).toBeInTheDocument();
    });

    it("clears alert when user changes username", async () => {
      const actions = {
        postLogin: jest.fn().mockRejectedValue({
          response: {
            data: {
              message: "Login failed",
            },
          },
        }),
      };
      const history = {
        push: jest.fn(),
      };
      const { findByText, queryByText } = setUpForSubmit({ actions, history });
      fireEvent.click(button);
      let alert = await findByText("Login failed");
      fireEvent.change(usernameInput, changeEvent("updated-username"));

      alert = queryByText("Login failed");
      expect(alert).not.toBeInTheDocument();
    });

    it("clears alert when user changes password", async () => {
      const actions = {
        postLogin: jest.fn().mockRejectedValue({
          response: {
            data: {
              message: "Login failed",
            },
          },
        }),
      };
      const history = {
        push: jest.fn(),
      };
      const { findByText, queryByText } = setUpForSubmit({ actions, history });
      fireEvent.click(button);

      await findByText("Login failed");
      // disapearence of alert is not async is instant that why can be query by text
      fireEvent.change(passwordInput, changeEvent("updated-P4ssword"));

      // Very interesting case that in this place we should put queryByText not findByText
      const alert = queryByText("Login failed");
      expect(alert).not.toBeInTheDocument();
    });

    // it is not efficient to write tests for styling because it may change more often than busines logic
    it("does not allow user to click the Login Up button when there is an ongoing api call", () => {
      // we are going to mock it
      const actions = {
        postLogin: mockAsyncDelayed(),
      };
      const history = {
        push: jest.fn(),
      };
      setUpForSubmit({ actions, history });
      fireEvent.click(button);
      fireEvent.click(button);
      fireEvent.click(button);
      expect(actions.postLogin).toHaveBeenCalledTimes(1);
    });

    it("displays spinner when there is an ongoing api call", () => {
      // we are going to mock it
      const actions = {
        postLogin: mockAsyncDelayed(),
      };
      const history = {
        push: jest.fn(),
      };
      const { queryByText } = setUpForSubmit({ actions, history });
      fireEvent.click(button);

      const spinner = queryByText("Loading...");
      expect(spinner).toBeInTheDocument();
    });

    it("hides spinner after api call finishes successfully", async () => {
      // we are going to mock it
      const actions = {
        postLogin: mockAsyncDelayed(),
      };
      const history = {
        push: jest.fn(),
      };
      const { queryByText } = setUpForSubmit({ actions, history });
      fireEvent.click(button);

      const spinner = queryByText("Loading...");
      await waitForElementToBeRemoved(spinner);
      // THIS HAS NO SENSE -> check this deeper
      // await waitFor(() => expect(spinner).not.toBeInTheDocument());
      expect(spinner).not.toBeInTheDocument();
    });

    it("hides spinner after api call finishes with error", async () => {
      // we are going to mock it
      const actions = {
        postLogin: jest.fn().mockResolvedValueOnce(() => {
          return new Promise((resolve, reject) => {
            setTimeout(() => {
              reject({
                response: { data: {} },
              });
            }, 300);
          });
        }),
      };
      const history = {
        push: jest.fn(),
      };

      const { findByText, queryByText } = setUpForSubmit({ actions, history });
      fireEvent.click(button);

      // this is nice example regardin async await
      const spinner = queryByText("Loading...");
      // let spinner = await findByText("Loading...");
      // await waitFor(() => expect(spinner));
      await waitForElementToBeRemoved(spinner);
      // spinner = queryByText("Loading...");
      expect(spinner).not.toBeInTheDocument();
    });

    it("redirects to homePage after succesful login", async () => {
      // we are going to mock it
      const actions = {
        postLogin: jest.fn().mockResolvedValue({}),
      };
      const history = {
        push: jest.fn(),
      };

      const { queryByText } = setUpForSubmit({ actions, history });
      fireEvent.click(button);

      await waitForElementToBeRemoved(() => queryByText("Loading..."));
      expect(history.push).toHaveBeenCalledWith("/");

      //work as well -> so there is like in every case many different solution
      // await waitFor(() => expect(history.push).toHaveBeenCalledWith("/"));
    });
  });
});
