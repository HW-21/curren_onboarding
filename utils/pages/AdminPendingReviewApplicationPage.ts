import { BasePage } from './BasePage'

export class AdminPendingReviewApplicationPage extends BasePage {
  private applicationId: string

  constructor(applicationId: string) {
    super()
    this.applicationId = applicationId
  }

  baseUrl(): string {
    return Cypress.env('adminUrl')
  }

  pathname(): string {
    return `/applications/pendingreviewapplication/${this.applicationId}/change/`
  }

  login(username: string, password: string) {
    cy.get('[data-test-id=username]').type(username)
    cy.get('[data-test-id=password]').type(password)
    cy.get('button').click()
  }

  addAdditionalInformation() {
    cy.contains('Add another Additional Info Request').click()
  }

  fillAdditionalInformation(index: number, type: string, text: string) {
    cy.get(`#id_additional_info-${index}-type`).select(type)
    cy.get(`#id_additional_info-${index}-text`).type(text)
  }

  saveAdditionalInformation() {
    cy.get('[name=_save]').click()
  }

  rejectApplication() {
    cy.get('a[href*="reject/?next"]').click()
  }

  inputReason() {
    cy.get('#id_reason').type('Test')
  }

  confirmReject() {
    cy.get('[name=_reject]').click()
  }

  restartApplication() {
    cy.get('a[href*="restart-application/?next"]').click()
  }

  confirmRestart() {
    cy.get('[name=_restart-application]').click()
  }
}
