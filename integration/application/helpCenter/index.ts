import { HelpCentrePage } from 'e2e/utils/pages/HelpCentrePage'

describe('HelpCentre', () => {
  it('should be able show all faq', () => {
    const helpCentrePage = new HelpCentrePage()

    helpCentrePage.visit()
    helpCentrePage.checkIsCurrentPage()

    cy.contains('Is Currenxie regulated?')
  })
})
