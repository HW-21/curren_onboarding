import { EnumApplicationCurrentStep } from 'cx-api/swagger'
import { ApiHelper } from 'e2e/utils/ApiHelper'
import { CacheHelper } from 'e2e/utils/CacheHelper'
import { ApplicationBuilder } from 'e2e/utils/data/ApplicationBuilder'
import { PhoneNumberVerificationForm } from 'e2e/utils/forms/PhoneNumberVerificationForm'
import { ApplicationPage } from 'e2e/utils/pages/ApplicationPage'

const cache = new CacheHelper('verify_phone')

describe('Setup', () => {
  it('setup data', () => {
    new ApplicationBuilder()
      .withSubaddress('verify_phone')
      .withVerifiedEmail()
      .withStep(EnumApplicationCurrentStep.VERIFY_PHONE)
      .build()
      .then((result) => {
        cache.write(result)
      })
  })
})

describe('Verify phone number', () => {
  beforeEach(() => {
    cache.load().then((data) => {
      const { email, password } = data

      ApiHelper.changeCurrentStep(email, EnumApplicationCurrentStep.VERIFY_PHONE)

      const applicationPage = new ApplicationPage()
      applicationPage.visit({
        login: {
          email,
          password,
        },
      })

      cy.waitUntil(
        () => {
          return Cypress.$(`#${EnumApplicationCurrentStep.VERIFY_PHONE}`).length
        },
        {
          timeout: 10000,
          interval: 500,
        },
      )

      const phoneNumberVerificationForm = new PhoneNumberVerificationForm()
      phoneNumberVerificationForm.checkIsCurrentForm()
    })
  })

  it('should not be able to continue to next step if input field empty', () => {
    const phoneNumberVerificationForm = new PhoneNumberVerificationForm()

    phoneNumberVerificationForm.continue()

    phoneNumberVerificationForm.checkErrors({
      securityCode: 'Required',
    })

    phoneNumberVerificationForm.checkIsCurrentForm()
  })

  it('should not be able to continue with invalid verification code format', () => {
    const phoneNumberVerificationForm = new PhoneNumberVerificationForm()

    cy.get('#securityCode').clear().type('1234567')
    phoneNumberVerificationForm.continue()
    phoneNumberVerificationForm.checkErrors({
      securityCode: 'Too long (maximum 6)',
    })

    cy.get('#securityCode').clear().type('12345')
    phoneNumberVerificationForm.checkErrors({
      securityCode: 'Too short (minimum 6)',
    })

    cy.get('#securityCode').clear().type('aaaaaa')
    phoneNumberVerificationForm.checkErrors({
      securityCode: 'Must contain at least one digit (0-9)',
    })
  })

  it('should not be able to continue with invalid verification code', () => {
    const phoneNumberVerificationForm = new PhoneNumberVerificationForm()

    cy.get('#securityCode').type('12345a')
    phoneNumberVerificationForm.continue()
    phoneNumberVerificationForm.checkIsCurrentForm()
  })
})
