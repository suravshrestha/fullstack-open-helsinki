import React from "react";

import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom/extend-expect";
import userEvent from "@testing-library/user-event";

import NoteForm from "./NoteForm";

test("<NoteForm /> updates parent state and calls onSubmit", async () => {
  const createNote = jest.fn();
  const user = userEvent.setup();

  render(<NoteForm createNote={createNote} />);

  const input = screen.getByRole("textbox");
  const sendButton = screen.getByText("save");

  await user.type(input, "testing a form...");
  await user.click(sendButton);

  // Ensures that form submit calles the createNote method
  expect(createNote.mock.calls).toHaveLength(1);

  // Ensures that the event handler is called with the right params
  expect(createNote.mock.calls[0][0].content).toBe("testing a form...");
});
