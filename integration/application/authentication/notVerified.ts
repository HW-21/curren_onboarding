import { CacheHelper } from 'e2e/utils/CacheHelper'
import { ApplicationBuilder } from 'e2e/utils/data/ApplicationBuilder'
// import { ApplicationPage } from 'e2e/utils/pages/ApplicationPage'
import { LoginPage } from 'e2e/utils/pages/LoginPage'

const cache = new CacheHelper('authentication_auth')

describe('Authentication Test', () => {
  describe('Authentication', () => {
    it('setup data', () => {
      new ApplicationBuilder()
        .withSubaddress('auth')
        .build()
        .then((result) => {
          cache.write(result)
        })
    })

    it('should not be able to login with not verified Email', () => {
      const loginPage = new LoginPage()
      // const applicationPage = new ApplicationPage()

      loginPage.visit()

      cache.load().then((data) => {
        const { email, password } = data
        loginPage.checkIsCurrentPage()
        loginPage.login(email, password)
      })

      const loginPageError = new LoginPage()
      loginPageError.checkIsCurrentPage()

      cy.contains('You need to verify your email address before logging in. Please check your inbox for the verification link.')
    })
  })
})
