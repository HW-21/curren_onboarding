import { CacheHelper } from 'e2e/utils/CacheHelper'
import { ApplicationBuilder } from 'e2e/utils/data/ApplicationBuilder'
import { ApplicationPage } from 'e2e/utils/pages/ApplicationPage'
import { LoginPage } from 'e2e/utils/pages/LoginPage'

const cache = new CacheHelper('authentication_auth')

describe('Authentication Test', () => {
  describe('Authentication', () => {
    it('setup data', () => {
      new ApplicationBuilder()
        .withSubaddress('auth')
        .withVerifiedEmail()
        .build()
        .then((result) => {
          cache.write(result)
        })
    })

    it('should be able to login and logout', () => {
      const loginPage = new LoginPage()
      const applicationPage = new ApplicationPage()

      loginPage.visit()

      cache.load().then((data) => {
        const { email, password } = data
        loginPage.checkIsCurrentPage()
        loginPage.login(email, password)
      })

      applicationPage.checkIsCurrentPage()
      applicationPage.waitForLoading()
      applicationPage.logout()
    })

    it('should redirect to login page if it is logged out', () => {
      const loginPage = new LoginPage()
      const applicationPage = new ApplicationPage()

      applicationPage.visit()
      loginPage.checkIsCurrentPage()
    })
  })
})
