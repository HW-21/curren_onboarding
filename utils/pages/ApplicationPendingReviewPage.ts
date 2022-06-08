import { BasePage } from './BasePage'

export class ApplicationPendingReviewPage extends BasePage {
  pathname(): string {
    return '/onboarding/application/'
  }

  checkIsCurrentPage(ignoreLocale = true) {
    super.checkIsCurrentPage(ignoreLocale)
    cy.get('#pendingReview').should('be.exist')
  }
}
