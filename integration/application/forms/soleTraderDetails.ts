import { EnumAccountTypeCompanyType, EnumApplicationCurrentStep } from 'cx-api/swagger'
import { ApiHelper } from 'e2e/utils/ApiHelper'
import { CacheHelper } from 'e2e/utils/CacheHelper'
import { ApplicationBuilder } from 'e2e/utils/data/ApplicationBuilder'
import { SoleTraderDetailsForm } from 'e2e/utils/forms/SoleTraderDetailsForm'
import { ApplicationPage } from 'e2e/utils/pages/ApplicationPage'
import { SanctionedCountryPage } from 'e2e/utils/pages/SanctionedCountryPage'

const cache = new CacheHelper('sole_trader_details')

describe('Setup', () => {
  it('setup data', () => {
    new ApplicationBuilder()
      .withSubaddress('sole_trader_details')
      .withVerifiedEmail()
      .withAccountType(EnumAccountTypeCompanyType.I)
      .withStep(EnumApplicationCurrentStep.SOLE_TRADER_DETAILS)
      .build()
      .then((result) => {
        cache.write(result)
      })
  })
})

describe('Sole trader Details', () => {
  beforeEach(() => {
    cache.load().then((data) => {
      const { email, password } = data

      ApiHelper.changeCurrentStep(email, EnumApplicationCurrentStep.SOLE_TRADER_DETAILS)

      const applicationPage = new ApplicationPage()
      applicationPage.visit({
        login: {
          email,
          password,
        },
      })

      const soleTraderDetailsForm = new SoleTraderDetailsForm()
      soleTraderDetailsForm.checkIsCurrentForm()
    })
  })

  it('should be able to process to next step', () => {
    const soleTraderDetailsForm = new SoleTraderDetailsForm()
    soleTraderDetailsForm.changeValues({
      registrationCountry: 'HK',
      registrationDocument: 'files/blank.pdf',
    })

    soleTraderDetailsForm.continue()

    soleTraderDetailsForm.getForm().should('not.exist')
  })

  it('should be able to redirect to sanctioned country page if country is not allowed', () => {
    const soleTraderDetailsForm = new SoleTraderDetailsForm()
    soleTraderDetailsForm.changeValues({
      registrationCountry: 'Iran',
      registrationDocument: 'files/blank.pdf',
    })

    soleTraderDetailsForm.continue()

    const sanctionedCountryPage = new SanctionedCountryPage()
    sanctionedCountryPage.checkIsCurrentPage()

    // check if history.state works
    cy.contains('Iran').should('be.exist')
  })

  it('should be able to update the form', () => {
    const soleTraderDetailsForm = new SoleTraderDetailsForm()
    soleTraderDetailsForm.changeValues({
      registrationCountry: 'China',
    })

    soleTraderDetailsForm.continue()

    soleTraderDetailsForm.getForm().should('not.exist')
  })
})
