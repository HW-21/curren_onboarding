import { BasePage } from './BasePage'

export class LoginPage extends BasePage {
  baseUrl(): string {
    return Cypress.env('loginUrl')
  }

  pathname(): string {
    return '/login'
  }

  login(username: string, password: string) {
    cy.get('[data-test-id=username]').type(username)
    cy.get('[data-test-id=password]').type(password)
    cy.get('button').click()
  }
}
