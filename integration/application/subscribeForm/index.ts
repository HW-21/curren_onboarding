import { MediaHubPage } from 'e2e/utils/pages/MediaHubPage'

describe('Subscribe form', () => {
  it('should be able show correct error message', () => {
    const mediaHubPage = new MediaHubPage()

    mediaHubPage.visit()
    mediaHubPage.checkIsCurrentPage()

    cy.get('#_form_5_').find('input[type=text]').type('12345')
    cy.get('#_form_5_').find('button[type=submit]').click()
    cy.get('#_form_5_').contains('Please enter a valid email.')
  })
})
