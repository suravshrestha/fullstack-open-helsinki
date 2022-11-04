const dummy = (blogs) => {
  return 1;
};

const totalLikes = (blogs) => {
  return blogs.length === 0
    ? 0
    : blogs.reduce((likes, blog) => likes + blog.likes, 0);
};

const favoriteBlog = (blogs) => {
  let maxLikes = -1;
  let favBlog;

  for (const blog of blogs) {
    if (blog.likes > maxLikes) {
      maxLikes = blog.likes;
      favBlog = blog;
    }
  }

  return favBlog
    ? { title: favBlog.title, author: favBlog.author, likes: favBlog.likes }
    : {};
};

const mostBlogs = (blogs) => {
  if (Object.keys(blogs).length === 0) {
    // Empty blogs
    return {};
  }

  let blogCounts = {};

  for (const blog of blogs) {
    blogCounts[blog.author] = blogCounts[blog.author]
      ? ++blogCounts[blog.author]
      : 1;
  }

  // Author with the most blogs
  const author = Object.keys(blogCounts).reduce((a, b) =>
    blogCounts[a] > blogCounts[b] ? a : b
  );

  return { author, blogs: blogCounts[author] };
};

const mostLikes = (blogs) => {
  if (Object.keys(blogs).length === 0) {
    // Empty blogs
    return {};
  }

  let likeCounts = {};

  for (const blog of blogs) {
    likeCounts[blog.author] = likeCounts[blog.author]
      ? likeCounts[blog.author] + blog.likes
      : blog.likes;
  }

  // Author with the most likes
  const author = Object.keys(likeCounts).reduce((a, b) =>
    likeCounts[a] > likeCounts[b] ? a : b
  );

  return { author, likes: likeCounts[author] };
};

module.exports = {
  dummy,
  totalLikes,
  favoriteBlog,
  mostBlogs,
  mostLikes,
};
