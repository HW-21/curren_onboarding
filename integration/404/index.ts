import { Four04Page } from 'e2e/utils/pages/404'

describe('404', () => {
  it('should be able show 404 page', () => {
    const four04Page = new Four04Page()

    four04Page.visit()
    four04Page.checkIsCurrentPage()

    cy.contains('404: Page not found.')
  })
})
