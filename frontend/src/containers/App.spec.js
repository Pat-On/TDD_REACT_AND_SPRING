import React from "react";
import {
  render,
  fireEvent,
  waitFor,
  queryByText,
} from "@testing-library/react";
import { MemoryRouter } from "react-router";

// redux - the same like in normal app
import { Provider } from "react-redux";
import { createStore } from "redux";
import authReducer from "../redux/authReducer";
import axios from "axios";
import App from "./App";
import configureStore from "../redux/configureStore";
//we are going to mock this apiCalls because child component has in in component did mount so rendering it
// will trigger it and give to use banch of errors
import * as apiCalls from "../api/apiCalls";

apiCalls.listUsers = jest.fn().mockResolvedValue({
  data: {
    content: [],
    number: 0,
    size: 3,
  },
});

// in testing we have to consider what we are rendering in dependency tree
// because app can render additional components which are not proper mocked
apiCalls.getUser = jest.fn().mockResolvedValue({
  data: {
    id: 1,
    username: "user1",
    displayName: "display1",
    image: "profile1.png",
  },
});
const mockFailGetUser = {
  response: {
    data: {
      message: "User not found",
    },
  },
};

beforeEach(() => {
  localStorage.clear();
  delete axios.defaults.headers.common["Authorization"];
});

const setup = (path) => {
  const store = configureStore(false);
  return render(
    <Provider store={store}>
      <MemoryRouter initialEntries={[path]}>
        <App />
      </MemoryRouter>
    </Provider>
  );
};

const changeEvent = (content) => {
  return {
    target: {
      value: content,
    },
  };
};

const setUserOneLoggedInStorage = () => {
  localStorage.setItem(
    "hoax-auth",
    JSON.stringify({
      id: 1,
      username: "user1",
      displayName: "display1",
      image: "profile1.png",
      password: "P4ssword",
      isLoggedIn: true,
    })
  );
};

// we need it to mock the request coming from users to user
const mockSuccessGetUser1 = {
  data: {
    id: 1,
    username: "user1",
    displayName: "display1",
    image: "profile1.png",
  },
};

const mockSuccessGetUser2 = {
  data: {
    id: 2,
    username: "user2",
    displayName: "display2",
    image: "profile2.png",
  },
};

describe("App", () => {
  it("displays homepage when url is /", () => {
    const { queryByTestId } = setup("/");
    expect(queryByTestId("homepage")).toBeInTheDocument();
  });

  it("displays LoginPage when url is /login", () => {
    const { container } = setup("/login");
    const header = container.querySelector("h1");
    expect(header).toHaveTextContent("Login");
  });

  it("displays only LoginPage when url is /login", () => {
    const { queryByTestId } = setup("/login");
    // const header = container.querySelector("h1");
    expect(queryByTestId("homepage")).not.toBeInTheDocument();
  });

  it("displays UserSignupPage  when url is /signup", () => {
    const { container } = setup("/signup");
    const header = container.querySelector("h1");
    expect(header).toHaveTextContent("Sign Up");
  });

  it("displays userpage when url is other than /, /login, /signup", () => {
    const { queryByTestId } = setup("/user1");
    // const header = container.querySelector("h1");
    expect(queryByTestId("userpage")).toBeInTheDocument();
  });

  // TESTS RELATED TO TOPBAR VISILIBILITY
  it("displays topBar when url is /", () => {
    const { container } = setup("/");
    const navigation = container.querySelector("nav");
    expect(navigation).toBeInTheDocument();
  });
  it("displays topBar when url is /login", () => {
    const { container } = setup("/login");
    const navigation = container.querySelector("nav");
    expect(navigation).toBeInTheDocument();
  });
  it("displays topBar when url is /signup", () => {
    const { container } = setup("/signup");
    const navigation = container.querySelector("nav");
    expect(navigation).toBeInTheDocument();
  });
  it("displays topBar when url is /user1", () => {
    const { container } = setup("/user1");
    const navigation = container.querySelector("nav");
    expect(navigation).toBeInTheDocument();
  });

  // TESTING IF THE ROUTER IN APPLICATION WORKING AFTER CLICKING SPECIFIC LINK
  it("shows the UserSignupPage when clicking signup", () => {
    const { queryByText, container } = setup("/");
    const signupLink = queryByText("Sign Up");
    fireEvent.click(signupLink);
    const header = container.querySelector("h1");
    expect(header).toHaveTextContent("Sign Up");
  });

  it("shows the UserSignupPage when clicking Login", () => {
    const { queryByText, container } = setup("/");
    const loginLink = queryByText("Login");
    fireEvent.click(loginLink);
    const header = container.querySelector("h1");
    expect(header).toHaveTextContent("Login");
  });

  it("shows the homePAge when clicking the logo", () => {
    const { queryByTestId, container } = setup("/login");
    const logo = container.querySelector("img");
    fireEvent.click(logo);
    expect(queryByTestId("homepage")).toBeInTheDocument();
  });

  it("displays my profile on topbar after login success", async () => {
    const { queryByPlaceholderText, container, queryByText, findByText } =
      setup("/login");
    const usernameInput = queryByPlaceholderText("Your username");
    fireEvent.change(usernameInput, changeEvent("user1"));
    const passwordInput = queryByPlaceholderText("Your password");
    fireEvent.change(passwordInput, changeEvent("P4ssword"));
    const button = container.querySelector("button");

    axios.post = jest.fn().mockResolvedValue({
      data: {
        id: 1,
        username: "user1",
        displayName: "display1",
        image: "profile1.png",
      },
    });
    fireEvent.click(button);
    const myProfileLink = await findByText("My Profile");
    expect(myProfileLink).toBeInTheDocument();

    // await waitFor(() => expect(findByText("My Profile")).toBeInTheDocument());
    // await waitFor(() => expect(spinner).not.toBeInTheDocument());
  });
  it("displays My Profile on TopBar after signup success", async () => {
    const { queryByPlaceholderText, container, queryByText, findByText } =
      setup("/signup");
    const displayNameInput = queryByPlaceholderText("Your display name");
    const usernameInput = queryByPlaceholderText("Your username");
    const passwordInput = queryByPlaceholderText("Your password");
    const passwordRepeat = queryByPlaceholderText("Repeat your password");

    fireEvent.change(displayNameInput, changeEvent("display1"));
    fireEvent.change(usernameInput, changeEvent("user1"));
    fireEvent.change(passwordInput, changeEvent("P4ssword"));
    fireEvent.change(passwordRepeat, changeEvent("P4ssword"));

    const button = container.querySelector("button");

    axios.post = jest
      .fn()
      .mockResolvedValueOnce({
        data: {
          message: "User saved",
        },
      })
      .mockResolvedValueOnce({
        data: {
          id: 1,
          username: "user1",
          displayName: "display1",
          image: "profile1.png",
        },
      });
    fireEvent.click(button);
    const myProfileLink = await findByText("My Profile");
    expect(myProfileLink).toBeInTheDocument();
  });

  it("saves logged in user data to localStorage after login success", async () => {
    const { queryByPlaceholderText, container, queryByText, findByText } =
      setup("/login");
    const usernameInput = queryByPlaceholderText("Your username");
    fireEvent.change(usernameInput, changeEvent("user1"));
    const passwordInput = queryByPlaceholderText("Your password");
    fireEvent.change(passwordInput, changeEvent("P4ssword"));
    const button = container.querySelector("button");

    axios.post = jest.fn().mockResolvedValue({
      data: {
        id: 1,
        username: "user1",
        displayName: "display1",
        image: "profile1.png",
      },
    });
    fireEvent.click(button);
    const myProfileLink = await findByText("My Profile");

    const dataInStorage = JSON.parse(localStorage.getItem("hoax-auth"));

    expect(dataInStorage).toEqual({
      id: 1,
      username: "user1",
      displayName: "display1",
      image: "profile1.png",
      password: "P4ssword",
      isLoggedIn: true,
    });

    // await waitFor(() => expect(findByText("My Profile")).toBeInTheDocument());
    // await waitFor(() => expect(spinner).not.toBeInTheDocument());
  });

  it("displays logged in topBar when storage has logged in user data", () => {
    setUserOneLoggedInStorage();
    const { queryByText } = setup("/");
    const myProfileLink = queryByText("My Profile");
    expect(myProfileLink).toBeInTheDocument();
  });

  it("sets axios authorization with base64 encoded user credentials after login success", async () => {
    const { queryByPlaceholderText, container, queryByText, findByText } =
      setup("/login");
    const usernameInput = queryByPlaceholderText("Your username");
    fireEvent.change(usernameInput, changeEvent("user1"));
    const passwordInput = queryByPlaceholderText("Your password");
    fireEvent.change(passwordInput, changeEvent("P4ssword"));
    const button = container.querySelector("button");

    axios.post = jest.fn().mockResolvedValue({
      data: {
        id: 1,
        username: "user1",
        displayName: "display1",
        image: "profile1.png",
      },
    });
    fireEvent.click(button);
    await findByText("My Profile");

    const axiosAuthorization = axios.defaults.headers.common["Authorization"];

    const encoded = btoa("user1:P4ssword");
    const expectedAuthorization = `Basic ${encoded}`;
    expect(axiosAuthorization).toBe(expectedAuthorization);
  });

  it("sets axios authorization with base64 encoded user credentials when storage has logged in user data", () => {
    setUserOneLoggedInStorage();
    setup("/");
    const axiosAuthorization = axios.defaults.headers.common["Authorization"];
    const encoded = btoa("user1:P4ssword");
    const expectedAuthorization = `Basic ${encoded}`;
    expect(axiosAuthorization).toBe(expectedAuthorization);
  });

  it("removes axios authorization header when user logout", () => {
    setUserOneLoggedInStorage();
    const { queryByText } = setup("/");
    fireEvent.click(queryByText("Logout"));

    const axiosAuthorization = axios.defaults.headers.common["Authorization"];
    expect(axiosAuthorization).toBeFalsy();
  });

  it("updates user page after clicking my profile whe another user page was opened", async () => {
    apiCalls.getUser = jest
      .fn()
      .mockResolvedValueOnce(mockSuccessGetUser2)
      .mockResolvedValueOnce(mockSuccessGetUser1);

    localStorage.setItem(
      "hoax-auth",
      JSON.stringify({
        id: 1,
        username: "user1",
        displayName: "display1",
        image: "profile1.png",
        password: "P4ssword",
        isLoggedIn: true,
      })
    );
    const { findByText } = setup("/user2");

    await findByText("display2@user2");

    const myProfileLink = await findByText("My Profile");
    fireEvent.click(myProfileLink);
    const user1info = await findByText("display1@user1");
    expect(user1info).toBeInTheDocument();
  });

  //navigation between the pages - App.spec
  it("updates user page after clicking my profile when another not existing user page was opened", async () => {
    apiCalls.getUser = jest
      .fn()
      .mockRejectedValueOnce(mockFailGetUser)
      .mockResolvedValueOnce(mockSuccessGetUser1);

    setUserOneLoggedInStorage();
    const { findByText } = setup("/user50");

    await findByText("User not found");

    const myProfileLink = await findByText("My Profile");
    fireEvent.click(myProfileLink);
    const user1info = await findByText("display1@user1");
    expect(user1info).toBeInTheDocument();
  });
});

// to hide the error but I am not sure if this is good practise check more about it.
console.error = () => {};
