import React from "react";
import {
  render,
  waitForDomChange,
  waitForElement,
  fireEvent,
} from "@testing-library/react";
import HoaxFeed from "./HoaxFeed";
import * as apiCalls from "../api/apiCalls";
// import "@testing-library/react/cleanup-after-each";

// without router it is going to give you failures in tests
import { MemoryRouter } from "react-router-dom";

// redux - the same like in normal app
import { Provider } from "react-redux";
import { createStore } from "redux";
import authReducer from "../redux/authReducer";

const loggedInStateUser1 = {
  id: 1,
  username: "user1",
  displayName: "display1",
  image: "profile1.png",
  password: "P4ssword",
  isLoggedIn: true,
};

const originalSetInterval = window.setInterval;
const originalClearInterval = window.clearInterval;

let timedFunction;

const useFakeIntervals = () => {
  window.setInterval = (callback, interval) => {
    timedFunction = callback;
  };
  window.clearInterval = () => {
    timedFunction = undefined;
  };
};

const useRealIntervals = () => {
  window.setInterval = originalSetInterval;
  window.clearInterval = originalClearInterval;
};

const runTimer = () => {
  timedFunction && timedFunction();
};

const setup = (props, state = loggedInStateUser1) => {
  const store = createStore(authReducer, state);
  return render(
    <Provider store={store}>
      <MemoryRouter>
        <HoaxFeed {...props} />
      </MemoryRouter>
    </Provider>
  );
};

const mockEmptyResponse = {
  data: {
    content: [],
  },
};

const mockSuccessGetNewHoaxesList = {
  data: [
    {
      id: 21,
      content: "This is the newst hoax",
      date: 1561294668539,
      user: {
        id: 1,
        username: "user1",
        displayName: "display1",
        image: "profile1.png",
      },
    },
  ],
};

const mockSuccessGetHoaxesSinglePage = {
  data: {
    content: [
      {
        id: 10,
        content: "This is the latest hoax",
        date: 1561294668539,
        user: {
          id: 1,
          username: "user1",
          displayName: "display1",
          image: "profile1.png",
        },
      },
    ],
    number: 0,
    first: true,
    last: true,
    size: 5,
    totalPages: 1,
  },
};

const mockSuccessGetHoaxesFirstOfMultiPage = {
  data: {
    content: [
      {
        id: 10,
        content: "This is the latest hoax",
        date: 1561294668539,
        user: {
          id: 1,
          username: "user1",
          displayName: "display1",
          image: "profile1.png",
        },
      },
      {
        id: 9,
        content: "This is hoax 9",
        date: 1561294668539,
        user: {
          id: 1,
          username: "user1",
          displayName: "display1",
          image: "profile1.png",
        },
      },
    ],
    number: 0,
    first: true,
    last: false,
    size: 5,
    totalPages: 2,
  },
};

const mockSuccessGetHoaxesLastOfMultiPage = {
  data: {
    content: [
      {
        id: 1,
        content: "This is the oldest hoax",
        date: 1561294668539,
        user: {
          id: 1,
          username: "user1",
          displayName: "display1",
          image: "profile1.png",
        },
      },
    ],
    number: 0,
    first: true,
    last: true,
    size: 5,
    totalPages: 2,
  },
};

afterEach(() => {
  apiCalls.loadHoaxes = null;
  apiCalls.loadOldHoaxes = null;
});

describe("HoaxFeed", () => {
  // in this test we started not from the layout side of the test in tdd
  // but we started frm the lifecycles
  // the reson of it is that this components "functionality" is more important
  describe("Lifecycle", () => {
    it("calls loadHoaxed when it is rendered", () => {
      apiCalls.loadHoaxes = jest.fn().mockResolvedValue(mockEmptyResponse);
      setup();
      expect(apiCalls.loadHoaxes).toBeCalledTimes(1);
    });

    it("calls loadHoaxes with user parameter when it is rendered with user property", () => {
      apiCalls.loadHoaxes = jest.fn().mockResolvedValue(mockEmptyResponse);
      setup({ user: "user1" });
      expect(apiCalls.loadHoaxes).toHaveBeenCalledWith("user1");
    });

    it("calls loadHoaxes without user parameter when it is rendered without user property", () => {
      apiCalls.loadHoaxes = jest.fn().mockResolvedValue(mockEmptyResponse);
      setup();
      const parameter = apiCalls.loadHoaxes.mock.calls[0][0];
      expect(parameter).toBeUndefined();
    });

    it("calls loadNewHoaxCount with topHoax id", async () => {
      useFakeIntervals();
      apiCalls.loadHoaxes = jest
        .fn()
        .mockResolvedValue(mockSuccessGetHoaxesFirstOfMultiPage);
      apiCalls.loadNewHoaxCount = jest
        .fn()
        .mockResolvedValue({ data: { count: 1 } });
      const { queryByText } = setup();
      await waitForDomChange();
      runTimer();

      await waitForElement(() => queryByText("There is 1 new hoax"));
      const firstParam = apiCalls.loadNewHoaxCount.mock.calls[0][0];
      expect(firstParam).toBe(10);
      useRealIntervals();
    });
    // why this one is failing? depraciated method I think
    // fit("calls loadNewHoaxCount with topHoax id", async () => {
    //   // useFakeIntervals();
    //   apiCalls.loadHoaxes = jest
    //     .fn()
    //     .mockResolvedValue(mockSuccessGetHoaxesFirstOfMultiPage);
    //   apiCalls.loadNewHoaxCount = jest
    //     .fn()
    //     .mockResolvedValue({ data: { count: 1 } });
    //   const { queryByText } = setup();
    //   // await waitForDomChange();
    //   // runTimer();

    //   await waitForElement(() => queryByText("There is 1 new hoax"));
    //   const firstParam = apiCalls.loadNewHoaxCount.mock.calls[0][0];
    //   expect(firstParam).toBe(10);
    //   // useRealIntervals();
    // });
    it("calls loadNewHoaxCount with topHoax id and username when rendered with user property", async () => {
      useFakeIntervals();
      apiCalls.loadHoaxes = jest
        .fn()
        .mockResolvedValue(mockSuccessGetHoaxesFirstOfMultiPage);
      apiCalls.loadNewHoaxCount = jest
        .fn()
        .mockResolvedValue({ data: { count: 1 } });
      const { queryByText } = setup({ user: "user1" });
      await waitForDomChange();
      runTimer();

      await waitForElement(() => queryByText("There is 1 new hoax"));
      expect(apiCalls.loadNewHoaxCount).toHaveBeenCalledWith(10, "user1");
      useRealIntervals();
    });

    it("displays new hoax count as 1 after loadNewHoaxCount success", async () => {
      useFakeIntervals();
      apiCalls.loadHoaxes = jest
        .fn()
        .mockResolvedValue(mockSuccessGetHoaxesFirstOfMultiPage);
      apiCalls.loadNewHoaxCount = jest
        .fn()
        .mockResolvedValue({ data: { count: 1 } });
      const { queryByText } = setup({ user: "user1" });

      await waitForDomChange();
      runTimer();

      const newHoaxCount = await waitForElement(() =>
        queryByText("There is 1 new hoax")
      );
      expect(newHoaxCount).toBeInTheDocument();
      useRealIntervals();
    });

    it("displays new hoax count constantly", async () => {
      useFakeIntervals();
      apiCalls.loadHoaxes = jest
        .fn()
        .mockResolvedValue(mockSuccessGetHoaxesFirstOfMultiPage);
      apiCalls.loadNewHoaxCount = jest
        .fn()
        .mockResolvedValue({ data: { count: 1 } });
      const { queryByText } = setup({ user: "user1" });

      await waitForDomChange();
      runTimer();

      await waitForElement(() => queryByText("There is 1 new hoax"));
      apiCalls.loadNewHoaxCount = jest
        .fn()
        .mockResolvedValue({ data: { count: 2 } });
      const newHoaxCount = await waitForElement(() =>
        queryByText("There are 2 new hoaxes")
      );
      runTimer();
      expect(newHoaxCount).toBeInTheDocument();
      useRealIntervals();
    }); //third parameter - how long is going to take test

    // done parameter
    it("does not call loadNewHoaxCount after component is unmounted", async (done) => {
      useFakeIntervals();
      apiCalls.loadHoaxes = jest
        .fn()
        .mockResolvedValue(mockSuccessGetHoaxesFirstOfMultiPage);
      apiCalls.loadNewHoaxCount = jest
        .fn()
        .mockResolvedValue({ data: { count: 1 } });
      const { queryByText, unmount } = setup({ user: "user1" });

      await waitForDomChange();
      runTimer();

      await waitForElement(() => queryByText("There is 1 new hoax"));

      unmount();
      expect(apiCalls.loadNewHoaxCount).toHaveBeenCalledTimes(1);
      // setTimeout(() => {
      //   expect(apiCalls.loadNewHoaxCount).toHaveBeenCalledTimes(1);
      //   done(); // it will finish our test
      // }, 3500);
      useRealIntervals();
    }); //third parameter - how long is going to take test

    // it("does not call loadNewHoaxCount after component is unmounted", async (done) => {
    //   apiCalls.loadHoaxes = jest
    //     .fn()
    //     .mockResolvedValue(mockSuccessGetHoaxesFirstOfMultiPage);
    //   apiCalls.loadNewHoaxCount = jest
    //     .fn()
    //     .mockResolvedValue({ data: { count: 1 } });
    //   const { queryByText, unmount } = setup({ user: "user1" });
    //   await waitForElement(() => queryByText("There is 1 new hoax"));
    //   unmount();
    //   setTimeout(() => {
    //     expect(apiCalls.loadNewHoaxCount).toHaveBeenCalledTimes(1);
    //     done();
    //   }, 3500);
    // }, 7000);

    it("displays new hoax count as 1 after loadNewHoaxCount success when user does not have hoaxes initially", async () => {
      useFakeIntervals();

      apiCalls.loadHoaxes = jest.fn().mockResolvedValue(mockEmptyResponse);
      apiCalls.loadNewHoaxCount = jest
        .fn()
        .mockResolvedValue({ data: { count: 1 } });
      const { queryByText } = setup({ user: "user1" });
      await waitForDomChange();
      runTimer();

      const newHoaxCount = await waitForElement(() =>
        queryByText("There is 1 new hoax")
      );
      expect(newHoaxCount).toBeInTheDocument();
      useRealIntervals();
    });
  });

  describe("Layout", () => {
    it("displays no hoax message when the response has empty page", async () => {
      apiCalls.loadHoaxes = jest.fn().mockResolvedValue(mockEmptyResponse);
      const { queryByText } = setup();
      const message = await waitForElement(() =>
        queryByText("There are no hoaxes")
      );
      expect(message).toBeInTheDocument();
    });

    it("does not display no hoax message when the response has page of hoax", async () => {
      apiCalls.loadHoaxes = jest
        .fn()
        .mockResolvedValue(mockSuccessGetHoaxesSinglePage);
      const { queryByText } = setup();
      await waitForDomChange();
      expect(queryByText("There are no hoaxes")).not.toBeInTheDocument();
    });

    it("displays spinner when loading the hoaxes", async () => {
      apiCalls.loadHoaxes = jest.fn().mockImplementation(() => {
        return new Promise((resolve, reject) => {
          setTimeout(() => {
            resolve(mockSuccessGetHoaxesSinglePage);
          }, 300);
        });
      });
      const { queryByText } = setup();
      expect(queryByText("Loading...")).toBeInTheDocument();

      // old way of canceling error with a updae of unmounted component
      // await waitForDomChange();  <- this was the reson of the error! so test was passing
    });

    it("displays hoax content", async () => {
      apiCalls.loadHoaxes = jest
        .fn()
        .mockResolvedValue(mockSuccessGetHoaxesSinglePage);
      const { queryByText } = setup();

      const hoaxContent = await waitForElement(() =>
        queryByText("This is the latest hoax")
      );
      expect(hoaxContent).toBeInTheDocument();
    });

    it("displays load more when there are next pages", async () => {
      apiCalls.loadHoaxes = jest
        .fn()
        .mockResolvedValue(mockSuccessGetHoaxesFirstOfMultiPage);
      const { queryByText } = setup();

      const loadMore = await waitForElement(() => queryByText("Load More"));
      expect(loadMore).toBeInTheDocument();
    });
  });

  describe("Interactions", () => {
    it("calls loadOldHoaxes with hoax id when clicking Load More", async () => {
      apiCalls.loadHoaxes = jest
        .fn()
        .mockResolvedValue(mockSuccessGetHoaxesFirstOfMultiPage);
      apiCalls.loadOldHoaxes = jest
        .fn()
        .mockResolvedValue(mockSuccessGetHoaxesLastOfMultiPage);
      const { queryByText } = setup();

      const loadMore = await waitForElement(() => queryByText("Load More"));
      fireEvent.click(loadMore);
      const firstParam = apiCalls.loadOldHoaxes.mock.calls[0][0];

      // this will give error in test because it is waiting for two params
      // expect(apiCalls.loadOldHoaxes).toHaveBeenCalledWith(9);
      expect(firstParam).toBe(9);
    });

    it("calls loadOldHoaxes with hoax id and username when clicking Load More when rendered with user property", async () => {
      apiCalls.loadHoaxes = jest
        .fn()
        .mockResolvedValue(mockSuccessGetHoaxesFirstOfMultiPage);
      apiCalls.loadOldHoaxes = jest
        .fn()
        .mockResolvedValue(mockSuccessGetHoaxesLastOfMultiPage);
      const { queryByText } = setup({ user: "user1" });

      const loadMore = await waitForElement(() => queryByText("Load More"));
      fireEvent.click(loadMore);

      expect(apiCalls.loadOldHoaxes).toHaveBeenCalledWith(9, "user1");
    });

    it("displays loaded ol hoax when lodOldHoaxes api call success", async () => {
      apiCalls.loadHoaxes = jest
        .fn()
        .mockResolvedValue(mockSuccessGetHoaxesFirstOfMultiPage);
      apiCalls.loadOldHoaxes = jest
        .fn()
        .mockResolvedValue(mockSuccessGetHoaxesLastOfMultiPage);
      const { queryByText } = setup();

      const loadMore = await waitForElement(() => queryByText("Load More"));
      fireEvent.click(loadMore);

      const oldHoax = await waitForElement(() =>
        queryByText("This is the oldest hoax")
      );
      expect(oldHoax).toBeInTheDocument();
    });

    it("hides Load More when loadOldHoxes api call returns last page", async () => {
      apiCalls.loadHoaxes = jest
        .fn()
        .mockResolvedValue(mockSuccessGetHoaxesFirstOfMultiPage);
      apiCalls.loadOldHoaxes = jest
        .fn()
        .mockResolvedValue(mockSuccessGetHoaxesLastOfMultiPage);
      const { queryByText } = setup();

      const loadMore = await waitForElement(() => queryByText("Load More"));
      fireEvent.click(loadMore);

      await waitForElement(() => queryByText("This is the oldest hoax"));
      expect(queryByText("Load More")).not.toBeInTheDocument();
    });
    //load new hoaxes
    it("calls loadNewHoaxes with hoax id when clicking New Hoax Count Card", async () => {
      useFakeIntervals();
      apiCalls.loadHoaxes = jest
        .fn()
        .mockResolvedValue(mockSuccessGetHoaxesFirstOfMultiPage);
      apiCalls.loadNewHoaxCount = jest
        .fn()
        .mockResolvedValue({ data: { count: 1 } });
      apiCalls.loadOldHoaxes = jest
        .fn()
        .mockResolvedValue(mockSuccessGetNewHoaxesList);

      const { queryByText } = setup();

      await waitForDomChange();
      runTimer();

      const newHoaxCount = await waitForElement(() =>
        queryByText("There is 1 new hoax")
      );
      fireEvent.click(newHoaxCount);
      const firstParam = apiCalls.loadOldHoaxes.mock.calls[0][0];

      // this will give error in test because it is waiting for two params
      // expect(apiCalls.loadOldHoaxes).toHaveBeenCalledWith(9);
      expect(firstParam).toBe(10);
      useRealIntervals();
    });

    it("replaces There is 1 new hoax with spinner when there is an active api call about it", async () => {
      useFakeIntervals();
      apiCalls.loadHoaxes = jest
        .fn()
        .mockResolvedValue(mockSuccessGetHoaxesFirstOfMultiPage);
      apiCalls.loadNewHoaxCount = jest
        .fn()
        .mockResolvedValue({ data: { count: 1 } });
      apiCalls.loadNewHoaxes = jest.fn().mockImplementation(() => {
        return new Promise((resolve, reject) => {
          setTimeout(() => {
            resolve(mockSuccessGetNewHoaxesList);
          }, 300);
        });
      });
      const { queryByText } = setup();
      await waitForDomChange();
      runTimer();
      const newHoaxCount = await waitForElement(() =>
        queryByText("There is 1 new hoax")
      );
      fireEvent.click(newHoaxCount);
      const spinner = await waitForElement(() => queryByText("Loading..."));
      expect(spinner).toBeInTheDocument();
      expect(queryByText("There is 1 new hoax")).not.toBeInTheDocument();
      useRealIntervals();
    });
    it("removes Spinner and There is 1 new hoax after active api call for loadNewHoaxes finishes with success", async () => {
      useFakeIntervals();
      apiCalls.loadHoaxes = jest
        .fn()
        .mockResolvedValue(mockSuccessGetHoaxesFirstOfMultiPage);
      apiCalls.loadNewHoaxCount = jest
        .fn()
        .mockResolvedValue({ data: { count: 1 } });
      apiCalls.loadNewHoaxes = jest
        .fn()
        .mockResolvedValue(mockSuccessGetNewHoaxesList);
      const { queryByText } = setup({ user: "user1" });
      await waitForDomChange();
      runTimer();
      const newHoaxCount = await waitForElement(() =>
        queryByText("There is 1 new hoax")
      );
      fireEvent.click(newHoaxCount);
      await waitForElement(() => queryByText("This is the newest hoax"));
      expect(queryByText("Loading...")).not.toBeInTheDocument();
      expect(queryByText("There is 1 new hoax")).not.toBeInTheDocument();
      useRealIntervals();
    });
    it("replaces Spinner with There is 1 new hoax after active api call for loadNewHoaxes fails", async () => {
      useFakeIntervals();
      apiCalls.loadHoaxes = jest
        .fn()
        .mockResolvedValue(mockSuccessGetHoaxesFirstOfMultiPage);
      apiCalls.loadNewHoaxCount = jest
        .fn()
        .mockResolvedValue({ data: { count: 1 } });
      apiCalls.loadNewHoaxes = jest.fn().mockImplementation(() => {
        return new Promise((resolve, reject) => {
          setTimeout(() => {
            reject({ response: { data: {} } });
          }, 300);
        });
      });
      const { queryByText } = setup();
      await waitForDomChange();
      runTimer();
      const newHoaxCount = await waitForElement(() =>
        queryByText("There is 1 new hoax")
      );
      fireEvent.click(newHoaxCount);
      await waitForElement(() => queryByText("Loading..."));
      await waitForDomChange();
      expect(queryByText("Loading...")).not.toBeInTheDocument();
      expect(queryByText("There is 1 new hoax")).toBeInTheDocument();
      useRealIntervals();
    });

    it("displays modal when clicking delete on hoax", async () => {
      apiCalls.loadHoaxes = jest
        .fn()
        .mockResolvedValue(mockSuccessGetHoaxesFirstOfMultiPage);
      apiCalls.loadNewHoaxCount = jest
        .fn()
        .mockResolvedValue({ data: { count: 1 } });

      const { queryByText, queryByTestId, container } = setup();
      await waitForDomChange();
      runTimer();
      const newHoaxCount = await waitForElement(() =>
        queryByText("There is 1 new hoax")
      );
      fireEvent.click(newHoaxCount);

      await waitForDomChange();
      const deleteButton = container.querySelectorAll("button")[0];
      fireEvent.click(deleteButton);

      const modalRootDiv = queryByTestId("modal-root");
      expect(modalRootDiv).toHaveClass("modal fade d-block show");
    });

    it("hides modal when clicking cancel", async () => {
      apiCalls.loadHoaxes = jest
        .fn()
        .mockResolvedValue(mockSuccessGetHoaxesFirstOfMultiPage);
      apiCalls.loadNewHoaxCount = jest
        .fn()
        .mockResolvedValue({ data: { count: 1 } });
      const { queryByTestId, container, queryByText } = setup();
      await waitForDomChange();
      const deleteButton = container.querySelectorAll("button")[0];
      fireEvent.click(deleteButton);

      fireEvent.click(queryByText("Cancel"));

      const modalRootDiv = queryByTestId("modal-root");
      expect(modalRootDiv).not.toHaveClass("d-block show");
    });
    it("displays modal with information about the action", async () => {
      apiCalls.loadHoaxes = jest
        .fn()
        .mockResolvedValue(mockSuccessGetHoaxesFirstOfMultiPage);
      apiCalls.loadNewHoaxCount = jest
        .fn()
        .mockResolvedValue({ data: { count: 1 } });
      const { container, queryByText } = setup();
      await waitForDomChange();
      const deleteButton = container.querySelectorAll("button")[0];
      fireEvent.click(deleteButton);

      const message = queryByText(
        `Are you sure to delete 'This is the latest hoax'?`
      );
      expect(message).toBeInTheDocument();
    });
    it("calls deleteHoax api with hoax id when delete button is clicked on modal", async () => {
      apiCalls.loadHoaxes = jest
        .fn()
        .mockResolvedValue(mockSuccessGetHoaxesFirstOfMultiPage);
      apiCalls.loadNewHoaxCount = jest
        .fn()
        .mockResolvedValue({ data: { count: 1 } });

      apiCalls.deleteHoax = jest.fn().mockResolvedValue({});
      const { container, queryByText } = setup();
      await waitForDomChange();
      const deleteButton = container.querySelectorAll("button")[0];
      fireEvent.click(deleteButton);
      const deleteHoaxButton = queryByText("Delete Hoax");
      fireEvent.click(deleteHoaxButton);
      expect(apiCalls.deleteHoax).toHaveBeenCalledWith(10);
    });
    it("hides modal after successful deleteHoax api call", async () => {
      apiCalls.loadHoaxes = jest
        .fn()
        .mockResolvedValue(mockSuccessGetHoaxesFirstOfMultiPage);
      apiCalls.loadNewHoaxCount = jest
        .fn()
        .mockResolvedValue({ data: { count: 1 } });

      apiCalls.deleteHoax = jest.fn().mockResolvedValue({});
      const { container, queryByText, queryByTestId } = setup();
      await waitForDomChange();
      const deleteButton = container.querySelectorAll("button")[0];
      fireEvent.click(deleteButton);
      const deleteHoaxButton = queryByText("Delete Hoax");
      fireEvent.click(deleteHoaxButton);
      await waitForDomChange();
      const modalRootDiv = queryByTestId("modal-root");
      expect(modalRootDiv).not.toHaveClass("d-block show");
    });
    it("removes the deleted hoax from document after successful deleteHoax api call", async () => {
      apiCalls.loadHoaxes = jest
        .fn()
        .mockResolvedValue(mockSuccessGetHoaxesFirstOfMultiPage);
      apiCalls.loadNewHoaxCount = jest
        .fn()
        .mockResolvedValue({ data: { count: 1 } });

      apiCalls.deleteHoax = jest.fn().mockResolvedValue({});
      const { container, queryByText } = setup();
      await waitForDomChange();
      const deleteButton = container.querySelectorAll("button")[0];
      fireEvent.click(deleteButton);
      const deleteHoaxButton = queryByText("Delete Hoax");
      fireEvent.click(deleteHoaxButton);
      await waitForDomChange();
      const deletedHoaxContent = queryByText("This is the latest hoax");
      expect(deletedHoaxContent).not.toBeInTheDocument();
    });
    it("disables Modal Buttons when api call in progress", async () => {
      apiCalls.loadHoaxes = jest
        .fn()
        .mockResolvedValue(mockSuccessGetHoaxesFirstOfMultiPage);
      apiCalls.loadNewHoaxCount = jest
        .fn()
        .mockResolvedValue({ data: { count: 1 } });

      apiCalls.deleteHoax = jest.fn().mockImplementation(() => {
        return new Promise((resolve, reject) => {
          setTimeout(() => {
            resolve({});
          }, 300);
        });
      });
      const { container, queryByText } = setup();
      await waitForDomChange();
      const deleteButton = container.querySelectorAll("button")[0];
      fireEvent.click(deleteButton);
      const deleteHoaxButton = queryByText("Delete Hoax");
      fireEvent.click(deleteHoaxButton);

      expect(deleteHoaxButton).toBeDisabled();
      expect(queryByText("Cancel")).toBeDisabled();
    });
    it("displays spinner when api call in progress", async () => {
      apiCalls.loadHoaxes = jest
        .fn()
        .mockResolvedValue(mockSuccessGetHoaxesFirstOfMultiPage);
      apiCalls.loadNewHoaxCount = jest
        .fn()
        .mockResolvedValue({ data: { count: 1 } });

      apiCalls.deleteHoax = jest.fn().mockImplementation(() => {
        return new Promise((resolve, reject) => {
          setTimeout(() => {
            resolve({});
          }, 300);
        });
      });
      const { container, queryByText } = setup();
      await waitForDomChange();
      const deleteButton = container.querySelectorAll("button")[0];
      fireEvent.click(deleteButton);
      const deleteHoaxButton = queryByText("Delete Hoax");
      fireEvent.click(deleteHoaxButton);
      const spinner = queryByText("Loading...");
      expect(spinner).toBeInTheDocument();
    });
    it("hides spinner when api call finishes", async () => {
      apiCalls.loadHoaxes = jest
        .fn()
        .mockResolvedValue(mockSuccessGetHoaxesFirstOfMultiPage);
      apiCalls.loadNewHoaxCount = jest
        .fn()
        .mockResolvedValue({ data: { count: 1 } });

      apiCalls.deleteHoax = jest.fn().mockImplementation(() => {
        return new Promise((resolve, reject) => {
          setTimeout(() => {
            resolve({});
          }, 300);
        });
      });
      const { container, queryByText } = setup();
      await waitForDomChange();
      const deleteButton = container.querySelectorAll("button")[0];
      fireEvent.click(deleteButton);
      const deleteHoaxButton = queryByText("Delete Hoax");
      fireEvent.click(deleteHoaxButton);
      await waitForDomChange();
      const spinner = queryByText("Loading...");
      expect(spinner).not.toBeInTheDocument();
    });
  });
});

console.error = () => {};
// console.warn = () => {};
