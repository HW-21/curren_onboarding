import { ApplicationBuilder } from 'e2e/utils/data/ApplicationBuilder'
import { VerificationEmail } from 'e2e/utils/emails/VerificationEmail'
import { ApplicationPage } from 'e2e/utils/pages/ApplicationPage'
import { HomePage } from 'e2e/utils/pages/HomePage'
import { LoginPage } from 'e2e/utils/pages/LoginPage'
import { SignupFormPage } from 'e2e/utils/pages/SignupFormPage'

describe('Locale Tests', () => {
  it('should redirect to a path with prefix en-hk if no locale is provided', () => {
    const homePage = new HomePage()
    homePage.visit()
    homePage.checkLanguage('en-HK')
  })

  it.skip('should be able to change language', () => {
    const homePage = new HomePage()
    homePage.visit()

    const languages = [
      { code: 'zh-HK', path: 'zh-HK', checkString: '註冊' },
      { code: 'zh-CN', path: 'zh-CN', checkString: '注册' },
      { code: 'en-HK', path: 'en-HK', checkString: 'Sign up' },
      { code: 'en-GB', path: 'en-GB', checkString: 'Sign up' },
    ]

    languages.forEach(({ code, path, checkString }) => {
      homePage.changeLanguage(code)
      homePage.checkLanguage(path)
      cy.get('body').contains(checkString)
      cy.reload()
      cy.get('body').contains(checkString)
    })
  })

  it('should redirect to en-hk in onboarding pages', () => {
    const signupFormPage = new SignupFormPage()
    signupFormPage.visit()
    signupFormPage.checkLanguage('en-HK')
  })

  it('should keep locale after login', () => {
    new ApplicationBuilder('zh-hant')
      .withSubaddress('locale')
      .build()
      .then(({ email, password }: any) => {
        VerificationEmail.findByEmail(email, 'zh-hant').then((r) => {
          r.visitVerificationLink()
        })

        const loginPage = new LoginPage()
        loginPage.checkIsCurrentPage()
        loginPage.login(email, password)

        const applicationPage = new ApplicationPage()
        applicationPage.checkLanguage('zh-hk')
      })
  })

  // This test will only work with `gatsby build`
  it('should be able to render correct language for server side rendering', () => {
    cy.request('/en-hk/')
      .its('body')
      .then((html) => {
        expect(html).contains('Sign up')
      })
    cy.request('/en-gb/')
      .its('body')
      .then((html) => {
        expect(html).contains('Sign up')
      })
    cy.request('/zh-hk/')
      .its('body')
      .then((html) => {
        expect(html).contains('註冊')
      })
    cy.request('/zh-cn/')
      .its('body')
      .then((html) => {
        expect(html).contains('注册')
      })
  })
})
