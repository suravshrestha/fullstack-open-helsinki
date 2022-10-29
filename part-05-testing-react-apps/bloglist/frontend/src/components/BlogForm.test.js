import React from "react";

import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom/extend-expect";
import userEvent from "@testing-library/user-event";

import BlogForm from "./BlogForm";

const blog = {
  title: "Go To Statement Considered Harmful",
  author: "Edsger W. Dijkstra",
  url: "http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html",
  likes: 5,
};

test("<BlogForm /> sends correct details of blog on submit", async () => {
  const createBlog = jest.fn();
  const user = userEvent.setup();

  const { container } = render(<BlogForm createBlog={createBlog} />);

  const titleInput = container.querySelector("#blog-title-input");
  const authorInput = container.querySelector("#blog-author-input");
  const urlInput = container.querySelector("#blog-url-input");

  const createBtn = screen.getByText("create");

  await user.type(titleInput, blog.title);
  await user.type(authorInput, blog.author);
  await user.type(urlInput, blog.url);

  await user.click(createBtn);

  // createBlog is called once
  expect(createBlog.mock.calls).toHaveLength(1);

  // Check the arguments to the function createBlog
  expect(createBlog.mock.calls[0][0].title).toBe(blog.title);
  expect(createBlog.mock.calls[0][0].author).toBe(blog.author);
  expect(createBlog.mock.calls[0][0].url).toBe(blog.url);
});
