declare namespace Cypress {
  interface Chainable {
    adminLogin({ username: string, password: string }): Chainable
  }
}
