import React from "react";

import "@testing-library/jest-dom/extend-expect";
import { render } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { act } from "react-dom/test-utils";

import Blog from "./Blog";

describe("<Blog />", () => {
  const blog = {
    title: "Go To Statement Considered Harmful",
    author: "Edsger W. Dijkstra",
    url: "http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html",
    likes: 5,
  };

  let container;
  let updateBlog = jest.fn();

  beforeEach(() => {
    container = render(<Blog blog={blog} updateBlog={updateBlog} />).container;
  });

  test("renders title and author by default", () => {
    const div = container.querySelector(".blog");
    expect(div).toHaveTextContent(blog.title);
    expect(div).toHaveTextContent(blog.author);
  });

  test("does not render url and number of likes by default", () => {
    const div = container.querySelector(".blog");
    expect(div).not.toHaveTextContent(blog.likes, { exact: false });
    expect(div).not.toHaveTextContent(blog.url, { exact: false });
  });

  test("after clicking the view button, blog's url and number of likes are displayed", async () => {
    const user = userEvent.setup();
    const button = container.querySelector(".view-details");
    await user.click(button);

    const div = container.querySelector(".blog-details");

    expect(div).toHaveTextContent(blog.url);
    expect(div).toHaveTextContent("likes " + blog.likes);
  });

  test("props event handler is called when like button is clicked", async () => {
    const user = userEvent.setup();
    const viewDetailsBtn = container.querySelector(".view-details");
    await user.click(viewDetailsBtn);

    const blogDetailsDiv = container.querySelector(".blog-details");
    const likeBtn = blogDetailsDiv.querySelector(".like-btn");

    await act(async () => {
      /* fire events that update state */
      await likeBtn.click();
      await likeBtn.click();
    });

    expect(updateBlog).toHaveBeenCalledTimes(2);
  });
});
