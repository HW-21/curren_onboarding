import { BasePage } from './BasePage'

export class PendingVerificationPage extends BasePage {
  pathname(): string {
    return '/onboarding/pending-verification/'
  }

  checkEmail(email: string) {
    cy.contains(email).should('be.exist')
  }
}
