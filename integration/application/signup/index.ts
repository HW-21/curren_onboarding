import { CacheHelper } from 'e2e/utils/CacheHelper'
import { ApplicationBuilder } from 'e2e/utils/data/ApplicationBuilder'
import { SignupForm } from 'e2e/utils/forms/SignupForm'
import { PendingVerificationPage } from 'e2e/utils/pages/PendingVerificationPage'
import { SignupFormPage } from 'e2e/utils/pages/SignupFormPage'

const cache = new CacheHelper('signup')

describe('Signup Form', () => {
  describe('Setup', () => {
    it('setup data', () => {
      new ApplicationBuilder()
        .withSubaddress('signup')
        .withNewUser(false)
        .build()
        .then((result) => {
          cache.write(result)
        })
    })
  })

  describe('GA', () => {
    it('should be able to register a new account', () => {
      cache.load().then(({ email, password }) => {
        const signupFormPage = new SignupFormPage()
        const pendingVerificationPage = new PendingVerificationPage()
        const signupForm = new SignupForm()

        signupFormPage.visit({
          search: {
            service: 'GA',
          },
        })

        signupFormPage.checkIsCurrentPage()

        signupForm.changeValues({
          email,
        })
        signupForm.continue()

        signupForm.changeValues({
          password: password,
          confirmPassword: password,
        })
        signupForm.continue()

        pendingVerificationPage.checkIsCurrentPage()
        pendingVerificationPage.checkEmail(email)
      })
    })

    it('should reject if email is registered before', () => {
      const signupFormPage = new SignupFormPage()
      const signupForm = new SignupForm()

      signupFormPage.visit({
        search: {
          service: 'GA',
        },
      })
      signupFormPage.checkIsCurrentPage()

      cache.load().then(({ email, password }) => {
        signupForm.changeValues({
          email,
        })
        signupForm.continue()

        signupForm.changeValues({
          password: password,
          confirmPassword: password,
        })
        signupForm.continue()

        signupFormPage.checkIsCurrentPage()

        signupForm.checkErrors({
          email: 'exists',
        })
      })
    })
    it('should reject if registered email is in uppercase', () => {
      const signupFormPage = new SignupFormPage()
      const signupForm = new SignupForm()

      signupFormPage.visit({
        search: {
          service: 'GA',
        },
      })
      signupFormPage.checkIsCurrentPage()

      cache.load().then(({ email, password }) => {
        const emailCapitalized = email.toUpperCase()
        signupForm.changeValues({
          email: emailCapitalized,
        })
        signupForm.continue()

        signupForm.changeValues({
          password: password,
          confirmPassword: password,
        })
        signupForm.continue()

        signupFormPage.checkIsCurrentPage()
        cy.contains('Already signed up and onboarded')
      })
    })

    it('should reject if password and confirmPassword not match', () => {
      const email = `${new Date().valueOf().toString()}+signup@text.xyz` // new email

      const signupFormPage = new SignupFormPage()
      const signupForm = new SignupForm()

      signupFormPage.visit({
        search: {
          service: 'GA',
        },
      })
      signupFormPage.checkIsCurrentPage()

      signupForm.changeValues({
        email,
      })
      signupForm.continue()

      signupForm.continue()
      signupForm.checkErrors({
        password: 'Required',
        confirmPassword: 'Required',
      })

      signupForm.changeValues({
        password: Cypress.env('testPassword'),
        confirmPassword: Cypress.env('testPassword') + '1',
      })
      signupForm.continue()

      signupForm.checkErrors({
        confirmPassword: "The passwords didn't match. Please try again",
      })
    })

    it('should not go to next step if email is not valid', () => {
      const signupFormPage = new SignupFormPage()
      const signupForm = new SignupForm()

      signupFormPage.visit({
        search: {
          service: 'GA',
        },
      })
      signupFormPage.checkIsCurrentPage()

      signupForm.continue()

      signupForm.checkErrors({
        email: 'Required',
      })

      signupForm.changeValues({
        email: '123456',
      })
      signupForm.continue()

      signupForm.checkErrors({
        email: 'Invalid Email format',
      })
    })

    it('should not go to next step if password is not valid', () => {
      cache.load().then(({ email /*, password */ }) => {
        const signupFormPage = new SignupFormPage()
        // const pendingVerificationPage = new PendingVerificationPage()
        const signupForm = new SignupForm()

        signupFormPage.visit({
          search: {
            service: 'GA',
          },
        })

        signupFormPage.checkIsCurrentPage()

        signupForm.changeValues({
          email,
        })
        signupForm.continue()

        signupForm.changeValues({
          password: '1234Aa*',
        })
        signupForm.continue()

        signupForm.checkErrors({
          password: 'Too short (minimum 8)',
        })
        signupForm.changeValues({
          password: '12345aa*',
        })
        signupForm.continue()

        signupForm.checkErrors({
          password: 'Must contain at least one uppercase letter (a-z)',
        })
        signupForm.changeValues({
          password: '12345AA*',
        })
        signupForm.continue()

        signupForm.checkErrors({
          password: 'Must contain at least one lowercase letter (a-z)',
        })
        signupForm.changeValues({
          password: '12345Abc',
        })
        signupForm.continue()

        signupForm.checkErrors({
          password: 'Must contain at least one special character',
        })
        signupForm.changeValues({
          password: 'AbcdeAb*',
        })
        signupForm.continue()

        signupForm.checkErrors({
          password: 'Must contain at least one digit (0-9)',
        })
      })
    })
  })
})
