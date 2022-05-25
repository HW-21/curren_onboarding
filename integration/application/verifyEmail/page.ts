import { CacheHelper } from 'e2e/utils/CacheHelper'
import { ApplicationBuilder } from 'e2e/utils/data/ApplicationBuilder'
import { VerificationEmail } from 'e2e/utils/emails/VerificationEmail'
import { LoginPage } from 'e2e/utils/pages/LoginPage'
import { VerifyEmailPage } from 'e2e/utils/pages/VerifyEmailPage'

const cache = new CacheHelper('verify_email')

describe('Verify Registration Page', function () {
  describe('Verification Failure', () => {
    it('should redirect to login with correct search parameter if server reject the pathname', () => {
      const verifyEmailPage = new VerifyEmailPage()
      const loginPage = new LoginPage()

      verifyEmailPage.visit({
        search: {
          user_id: 0,
          timestamp: 0,
          signature: 0,
        },
        withDefaultLanguage: false,
      })

      loginPage.checkIsCurrentPage()
      loginPage.checkQueryParameter({
        action: 'emailVerificationFailed',
      })
    })
  })

  describe('Verification Success', () => {
    it('should be able to setup data', () => {
      new ApplicationBuilder()
        .withSubaddress('verify_email')
        .build()
        .then((result) => {
          cache.write(result)
        })
    })

    it('should redirect to verification success page', () => {
      const loginPage = new LoginPage()
      cache.load().then(({ email }) => {
        VerificationEmail.findByEmail(email).then((r) => {
          r.visitVerificationLink()
        })
      })

      loginPage.checkIsCurrentPage()
      loginPage.checkQueryParameter({
        action: 'emailVerificationSuccess',
      })
    })
  })
})
