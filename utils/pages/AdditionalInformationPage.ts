import { BasePage } from './BasePage'

export class AdditionalInformationPage extends BasePage {
  pathname(): string {
    return '/onboarding/application/'
  }

  checkIsCurrentPage(ignoreLocale = true) {
    super.checkIsCurrentPage(ignoreLocale)
    cy.get('#additionalInformationRequired').should('be.exist')
  }

  confirm() {
    cy.get('#confirm').click()
  }

  checkConfirmButton(disabled: boolean) {
    cy.get('#confirm').should(disabled ? 'be.disabled' : 'not.be.disabled')
  }
}
