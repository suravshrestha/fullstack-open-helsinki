describe("Blog app", function () {
  const user = {
    name: "John Doe",
    username: "johndoe",
    password: "password",
  };

  const user2 = {
    name: "Jane Doe",
    username: "janedoe",
    password: "password",
  };

  const blog = {
    title: "React patterns",
    author: "Michael Chan",
    url: "https://reactpatterns.com/",
  };

  beforeEach(function () {
    cy.request("POST", "http://localhost:3001/api/testing/reset");
    cy.request("POST", "http://localhost:3001/api/users/", user);
    cy.request("POST", "http://localhost:3001/api/users/", user2);
    cy.visit("http://localhost:3000");
  });

  it("Login form is shown", function () {
    cy.contains("Log in to the application");
    cy.get("#username-input");
    cy.get("#password-input");
    cy.get("#login-btn");
  });

  describe("Login", function () {
    it("succeeds with correct credentials", function () {
      cy.get("#username-input").type(user.username);
      cy.get("#password-input").type(user.password);
      cy.get("#login-btn").click();

      cy.contains(`${user.name} logged in`);
    });

    it("fails with wrong credentials", function () {
      cy.get("#username-input").type(user.username);
      cy.get("#password-input").type("incorrect password");
      cy.get("#login-btn").click();

      // .should allows more diverse tests in comparison to .contains
      cy.get(".msg")
        .should("contain", "wrong username or password")
        .and("have.css", "color", "rgb(255, 0, 0)");

      cy.get("html").should("not.contain", "John Doe logged in");
    });
  });

  describe("When logged in", function () {
    beforeEach(function () {
      // Custom cypress command login defined in ../support/commands.js
      const { username, password } = user;
      cy.login({ username, password });
    });

    it("A blog can be created", function () {
      cy.contains("button", "new blog").click();

      cy.get("#blog-title-input").type(blog.title);
      cy.get("#blog-author-input").type(blog.author);
      cy.get("#blog-url-input").type(blog.url);

      cy.contains("button", "create").click();
      cy.contains(blog.title);

      cy.get(".msg").should(
        "contain",
        `a new blog '${blog.title}' by ${blog.author} added`
      );
    });

    describe("and a blog exists", function () {
      beforeEach(function () {
        cy.createBlog(blog);
      });

      it("it can be liked", function () {
        cy.contains(blog.title).contains("button", "view").click();

        cy.get(".likes-count").contains(0);
        cy.get(".like-btn").click();
        cy.get(".likes-count").contains(1);
      });

      it("it can be deleted if the current user is the author", function () {
        cy.contains(blog.title).contains("button", "view").click();
        cy.get(".remove-btn").click();

        cy.get("body").should("contain", blog.title);
        cy.get(".msg").should("contain", "Successfully removed the blog");
      });

      it("it can not be deleted if the current user is not the author", function () {
        const { username, password } = user2;
        cy.login({ username, password });

        cy.contains(blog.title).contains("button", "view").click();
        cy.get("body").should("not.contain", ".remove-btn");
      });
    });

    describe("and several blogs exist", function () {
      beforeEach(function () {
        cy.createBlog({
          title: "first blog",
          author: "Jane Doe",
          url: "https://thisurldoesnotexists.com/1",
        });

        cy.createBlog({
          title: "second blog",
          author: "John Doe",
          url: "https://thisurldoesnotexists.com/2",
        });

        cy.createBlog({
          title: "third blog",
          author: "Janet Doe",
          url: "https://thisurldoesnotexists.com/3",
        });
      });

      it.only("the blogs are ordered in descending order of likes", function () {
        cy.contains("first blog").contains("button", "view").click();
        cy.get(".like-btn").as("likeBtn1");

        cy.contains("second blog").contains("button", "view").click();
        cy.get(".like-btn").eq(1).as("likeBtn2");

        cy.contains("third blog").contains("button", "view").click();
        cy.get(".like-btn").eq(2).as("likeBtn3");

        cy.get("@likeBtn1").click();
        cy.wait(500);

        for (let i = 0; i < 2; ++i) {
          cy.get("@likeBtn2").click();
          cy.wait(500);
        }

        for (let i = 0; i < 3; ++i) {
          cy.get("@likeBtn3").click();
          cy.wait(500);
        }

        cy.get(".blog-details").then((blogs) => {
          cy.wrap(blogs[0]).should("contain", "likes 3");
          cy.wrap(blogs[1]).should("contain", "likes 2");
          cy.wrap(blogs[2]).should("contain", "likes 1");
        });
      });
    });
  });
});
