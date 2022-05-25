import { EnumAccountTypeCompanyType, EnumApplicationCurrentStep } from 'cx-api/swagger'
import { ApiHelper } from 'e2e/utils/ApiHelper'
import { CacheHelper } from 'e2e/utils/CacheHelper'
import { ApplicationBuilder } from 'e2e/utils/data/ApplicationBuilder'
import { IncomingsFromGatewaysForm } from 'e2e/utils/forms/IncomingsFromGatewaysForm'
import { IncomingsFromOtherBusinessesForm } from 'e2e/utils/forms/IncomingsFromOtherBusinessesForm'
import { ApplicationPage } from 'e2e/utils/pages/ApplicationPage'

const cache = new CacheHelper('payment_gateways')

describe('Setup', () => {
  it('setup data', () => {
    new ApplicationBuilder()
      .withSubaddress('payment_gateways')
      .withVerifiedEmail()
      .withAccountType(EnumAccountTypeCompanyType.C)
      .withStep(EnumApplicationCurrentStep.PAYMENT_GATEWAYS)
      .build()
      .then((result) => {
        cache.write(result)
      })
  })
})

describe('Incomings from payment gateways', () => {
  beforeEach(() => {
    cache.load().then((data) => {
      const { email, password } = data

      ApiHelper.changeCurrentStep(email, EnumApplicationCurrentStep.PAYMENT_GATEWAYS)

      const applicationPage = new ApplicationPage()
      applicationPage.visit({
        login: {
          email,
          password,
        },
      })

      const incomingsFromGatewaysForm = new IncomingsFromGatewaysForm()
      incomingsFromGatewaysForm.checkIsCurrentForm()
    })
  })

  it('should throw validation error if incomingsFromMarketplaces is null', () => {
    const incomingsFromGatewaysForm = new IncomingsFromGatewaysForm()
    incomingsFromGatewaysForm.changeValues({
      incomingsFromPaymentGateways: 'Yes',
    })

    incomingsFromGatewaysForm.continue()

    incomingsFromGatewaysForm.checkErrors({
      marketplaces: 'Required',
    })
  })

  it('should be able to add other marketplaces and process to next step', () => {
    const incomingsFromGatewaysForm = new IncomingsFromGatewaysForm()
    incomingsFromGatewaysForm.changeValues({
      incomingsFromPaymentGateways: 'Yes',
    })

    incomingsFromGatewaysForm.addItem()
    incomingsFromGatewaysForm.addItem()

    cy.get('otherPaymentGateways[0]').type('Gateway1')
    cy.get('otherPaymentGateways[1]').type('Gateway2')

    incomingsFromGatewaysForm.continue()

    const incomingsFromOtherBusinessesForm = new IncomingsFromOtherBusinessesForm()
    incomingsFromOtherBusinessesForm.checkIsCurrentForm()
  })
})
