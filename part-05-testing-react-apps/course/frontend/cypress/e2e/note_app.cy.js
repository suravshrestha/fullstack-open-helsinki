describe("Note app", function () {
  beforeEach(function () {
    cy.request("POST", "http://localhost:3001/api/testing/reset");
    const user = {
      name: "John Doe",
      username: "johndoe",
      password: "ilovejohndoe",
    };
    cy.request("POST", "http://localhost:3001/api/users/", user);
    cy.visit("http://localhost:3000");
  });

  it("front page can be opened", function () {
    cy.contains("Notes");
    cy.contains(
      "Note app, Department of Computer Science, University of Helsinki 2022"
    );
  });

  it("login form can be opened", function () {
    cy.contains("button", "login").click();
  });

  it("user can log in", function () {
    cy.contains("button", "login").click();
    cy.get("#username").type("johndoe");
    cy.get("#password").type("ilovejohndoe");
    cy.get("#login-button").click();

    cy.contains("John Doe logged in");
  });

  // We can change it to it.only to run that test only
  // it.only("login fails with wrong password", function () {
  it("login fails with wrong password", function () {
    cy.contains("button", "login").click();
    cy.get("#username").type("johndoe");
    cy.get("#password").type("wrong");
    cy.get("#login-button").click();

    cy.get(".error").contains("wrong credentials");

    // With .should (allows more diverse tests)
    cy.get(".error")
      .should("contain", "wrong credentials")
      .and("have.css", "color", "rgb(255, 0, 0)")
      .and("have.css", "border-style", "solid");

    cy.get("html").should("not.contain", "John Doe logged in");
  });

  describe("when logged in", function () {
    beforeEach(function () {
      // cy.contains("button", "login").click();
      // cy.get("input:first").type("johndoe");
      // cy.get("input:last").type("ilovejohndoe");
      // cy.get("#login-button").click();

      // Custom cypress command login defined in ../support/commands.js
      cy.login({ username: "johndoe", password: "ilovejohndoe" });
    });

    it("a new note can be created", function () {
      cy.contains("button", "new note").click();
      cy.get("#note-input").type("a note created by cypress");
      cy.contains("button", "save").click();
      cy.contains("a note created by cypress");
    });

    describe("and a note exists", function () {
      beforeEach(function () {
        cy.createNote({
          content: "another note cypress",
          important: true,
        });
      });

      it("it can be made not important", function () {
        // .as: assign an alias to the button
        cy.contains("another note cypress")
          .parent()
          .find("button")
          .contains("make not important")
          .as("theButton");

        cy.get("@theButton").click();
        cy.get("@theButton").contains("make not important");
      });
    });

    describe("and several notes exist", function () {
      beforeEach(function () {
        cy.createNote({ content: "first note", important: false });
        cy.createNote({ content: "second note", important: false });
        cy.createNote({ content: "third note", important: false });
      });

      it("one of those can be made important", function () {
        cy.contains("second note").parent().find("button").as("theButton");
        cy.get("@theButton").click();
        cy.get("@theButton").should("contain", "make not important");
      });
    });
  });
});
