import { EnumAccountTypeCompanyType, EnumApplicationCurrentStep } from 'cx-api/swagger'
import { ApiHelper } from 'e2e/utils/ApiHelper'
import { CacheHelper } from 'e2e/utils/CacheHelper'
import { ApplicationBuilder } from 'e2e/utils/data/ApplicationBuilder'
import { IncomingsFromMarketplacesForm } from 'e2e/utils/forms/IncomingsFromMarketplacesForm'
import { IncomingsFromGatewaysForm } from 'e2e/utils/forms/IncomingsFromGatewaysForm'
import { ApplicationPage } from 'e2e/utils/pages/ApplicationPage'

const cache = new CacheHelper('marketplaces')

describe('Setup', () => {
  it('setup data', () => {
    new ApplicationBuilder()
      .withSubaddress('marketplaces')
      .withVerifiedEmail()
      .withAccountType(EnumAccountTypeCompanyType.C)
      .withStep(EnumApplicationCurrentStep.MARKETPLACES)
      .build()
      .then((result) => {
        cache.write(result)
      })
  })
})

describe('Incomings from marketplaces', () => {
  beforeEach(() => {
    cache.load().then((data) => {
      const { email, password } = data

      ApiHelper.changeCurrentStep(email, EnumApplicationCurrentStep.MARKETPLACES)

      const applicationPage = new ApplicationPage()
      applicationPage.visit({
        login: {
          email,
          password,
        },
      })

      const incomingsFromMarketplacesForm = new IncomingsFromMarketplacesForm()
      incomingsFromMarketplacesForm.checkIsCurrentForm()
    })
  })

  it('should throw validation error if incomingsFromMarketplaces is null', () => {
    const incomingsFromMarketplacesForm = new IncomingsFromMarketplacesForm()
    incomingsFromMarketplacesForm.changeValues({
      incomingsFromMarketplaces: 'Yes',
    })

    incomingsFromMarketplacesForm.continue()

    incomingsFromMarketplacesForm.checkErrors({
      marketplaces: 'Required',
    })
  })

  it('should be able to add other marketplaces and process to next step', () => {
    const incomingsFromMarketplacesForm = new IncomingsFromMarketplacesForm()
    incomingsFromMarketplacesForm.changeValues({
      incomingsFromMarketplaces: 'Yes',
    })

    incomingsFromMarketplacesForm.addItem()
    incomingsFromMarketplacesForm.addItem()

    cy.get('otherMarketplaces[0]').type('Other1')
    cy.get('otherMarketplaces[1]').type('Other2')

    incomingsFromMarketplacesForm.continue()

    const incomingsFromGatewaysForm = new IncomingsFromGatewaysForm()
    incomingsFromGatewaysForm.checkIsCurrentForm()
  })
})
