import React from "react";

import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom/extend-expect";
import userEvent from "@testing-library/user-event";

import NoteForm from "./NoteForm";

test("<NoteForm /> updates parent state and calls onSubmit", async () => {
  const createNote = jest.fn();
  const user = userEvent.setup();

  const { container } = render(<NoteForm createNote={createNote} />);

  // const input = screen.getByRole("textbox");
  // const input = screen.getAllByRole("textbox")[0];
  // const input = screen.getByPlaceholderText("write here note content");

  const input = container.querySelector("#note-input"); // Most flexible
  const sendButton = screen.getByText("save");

  await user.type(input, "testing a form...");
  await user.click(sendButton);

  // createNote is called once
  expect(createNote.mock.calls).toHaveLength(1);

  // The first argument of the first call to the createNote was "testing a form..."
  expect(createNote.mock.calls[0][0].content).toBe("testing a form...");
});
