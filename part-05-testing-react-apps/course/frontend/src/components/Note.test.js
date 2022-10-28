import React from "react";

import "@testing-library/jest-dom/extend-expect";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import Note from "./Note";

const note = {
  content: "Component testing is done with react-testing-library",
  important: true,
};

describe("<Note />", () => {
  let container, mockHandler;

  beforeEach(() => {
    mockHandler = jest.fn();

    // // Render into a container which is appended to document.body
    // render(<Note note={note} toggleImportance={mockHandler} />);

    container = render(
      <Note note={note} toggleImportance={mockHandler} />
    ).container;
  });

  test("renders content", () => {
    // Search for all elements that have a text node with the matching textContent
    const element = screen.getByText(
      "Component testing is done with react-testing-library",
      { exact: false } // substring match
    );

    // Print the element to the console
    // screen.debug(element);

    expect(element).toBeDefined();
  });

  test("has clickable button", async () => {
    // Setup a session to interact with the rendered component
    const user = userEvent.setup();

    const button = screen.getByText("make not important");
    await user.click(button);

    // Test if exact one click
    expect(mockHandler.mock.calls).toHaveLength(1);
  });

  test("has class .note", () => {
    // Print the document
    // screen.debug();

    const div = container.querySelector(".note");
    expect(div).toHaveTextContent(
      "Component testing is done with react-testing-library"
    );
  });
});
