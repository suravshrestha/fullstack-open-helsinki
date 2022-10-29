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

  describe("when logged in", function () {
    beforeEach(function () {
      cy.contains("button", "login").click();
      cy.get("input:first").type("johndoe");
      cy.get("input:last").type("ilovejohndoe");
      cy.get("#login-button").click();
    });

    it("a new note can be created", function () {
      cy.contains("button", "new note").click();
      cy.get("#note-input").type("a note created by cypress");
      cy.contains("button", "save").click();
      cy.contains("a note created by cypress");
    });

    describe("and a note exists", function () {
      beforeEach(function () {
        cy.contains("button", "new note").click();
        cy.get("#note-input").type("another note cypress");
        cy.contains("button", "save").click();
      });

      it("it can be made not important", function () {
        cy.contains("another note cypress")
          .contains("button", "make not important")
          .click();

        cy.contains("another note cypress").contains(
          "button",
          "make not important"
        );
      });
    });
  });
});
