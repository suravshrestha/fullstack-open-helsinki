import { useState } from "react";

const Blog = ({ blog, updateBlog, removeBlog, user }) => {
  const [detailsVisible, setDetailsVisible] = useState(false);

  const blogStyle = {
    paddingTop: 10,
    paddingLeft: 2,
    border: "solid",
    borderWidth: 1,
    marginBottom: 5,
  };

  const increaseLike = () => {
    updateBlog(blog.id, {
      likes: blog.likes + 1,
    });
  };

  const handleRemoveBtnClick = () => {
    if (window.confirm(`Remove blog '${blog.title}' by ${blog.author}`)) {
      removeBlog(blog.id);
    }
  };

  const blogDetails = () => (
    <div className="blog-details" style={blogStyle}>
      {blog.title}{" "}
      <button onClick={() => setDetailsVisible(false)}>hide</button>
      <br />
      {blog.url}
      <br />
      likes <span className="likes-count">{blog.likes}</span>{" "}
      <button className="like-btn" onClick={increaseLike}>
        like
      </button>
      <br />
      {blog.author}
      <br />
      {blog.user && blog.user.username === user.username && (
        <button className="remove-btn" onClick={handleRemoveBtnClick}>
          remove
        </button>
      )}
    </div>
  );

  return (
    <div>
      <div className="blog" style={blogStyle}>
        {blog.title} {blog.author}{" "}
        <button
          className="view-details"
          onClick={() => setDetailsVisible(true)}
        >
          view
        </button>
      </div>

      {detailsVisible && blogDetails()}
      <br />
    </div>
  );
};

export default Blog;
