import { BasePage } from './BasePage'

export class AdminRejectedApplicationPage extends BasePage {
  private applicationId: string

  constructor(applicationId: string) {
    super()
    this.applicationId = applicationId
  }

  baseUrl(): string {
    return Cypress.env('adminUrl')
  }

  pathname(): string {
    return `/applications/rejectedapplication/${this.applicationId}/change/`
  }

  login(username: string, password: string) {
    cy.get('[data-test-id=username]').type(username)
    cy.get('[data-test-id=password]').type(password)
    cy.get('button').click()
  }

  sendToPendingReview() {
    cy.contains('Send to pending review').click()
  }

  confirmSendToPendingReview() {
    cy.get('[name=_send-to-pending-review]').click()
  }
}
