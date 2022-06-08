import { MediaHubPage } from 'e2e/utils/pages/MediaHubPage'

describe('Subscribe form', () => {
  it('should be able show correct error message', () => {
    const mediaHubPage = new MediaHubPage()

    mediaHubPage.visit()
    mediaHubPage.checkIsCurrentPage()

    cy.get('#subscribe').find('input[type=text]').type('12345')
    cy.get('#subscribe').find('button[type=submit]').click()
    cy.get('#subscribe').contains('Invalid Email format')
  })
})
