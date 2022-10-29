describe("Note app", function () {
  beforeEach(function () {
    cy.visit("http://localhost:3000");
  });

  it("front page can be opened", function () {
    cy.contains("Notes");
    cy.contains(
      "Note app, Department of Computer Science, University of Helsinki 2022"
    );
  });

  it("login form can be opened", function () {
    cy.contains("login").click();
  });

  it("user can log in", function () {
    cy.contains("login").click();
    cy.get("#username").type("janetdoe");
    cy.get("#password").type("ilovejanetdoe");
    cy.get("#login-button").click();

    cy.contains("Janet Doe logged in");
  });

  describe("when logged in", function () {
    beforeEach(function () {
      cy.contains("login").click();
      cy.get("input:first").type("janetdoe");
      cy.get("input:last").type("ilovejanetdoe");
      cy.get("#login-button").click();
    });

    it("a new note can be created", function () {
      cy.contains("button", "new note").click();
      cy.get("#note-input").type("a note created by cypress");
      cy.contains("button", "save").click();
      cy.contains("a note created by cypress");
    });
  });
});
