import { EnumAccountTypeCompanyType, EnumApplicationCurrentStep } from 'cx-api/swagger'
import { CacheHelper } from 'e2e/utils/CacheHelper'
import { ApplicationBuilder } from 'e2e/utils/data/ApplicationBuilder'
import { ConfirmationForm } from 'e2e/utils/forms/ConfirmationForm'
import { ApplicationPage } from 'e2e/utils/pages/ApplicationPage'

const cache = new CacheHelper('termsConditions')

describe('Setup', () => {
  it('setup data', () => {
    new ApplicationBuilder()
      .withSubaddress('termsConditions')
      .withVerifiedEmail()
      .withAccountType(EnumAccountTypeCompanyType.C)
      .withStep(EnumApplicationCurrentStep.TERMS_CONDITIONS)
      .build()
      .then((result) => {
        cache.write(result)
      })
  })
})

describe('TermsConditions', () => {
  beforeEach(() => {
    const applicationPage = new ApplicationPage()

    cache.load().then((data: any) => {
      applicationPage.visit({
        login: data,
      })

      const termsConditionsForm = new ConfirmationForm()
      termsConditionsForm.checkIsCurrentForm()
    })
  })

  it('should not be able to continue to next step if Terms is unticked', () => {
    const termsConditionsForm = new ConfirmationForm()
    termsConditionsForm.continue()
    termsConditionsForm.changeValues({
      terms: false,
      restrictedPayments: true,
      restrictedCountries: true,
    })
    termsConditionsForm.checkIsCurrentForm()
  })

  it('should not be able to continue to next step if Restriced Payment is unticked', () => {
    const termsConditionsForm = new ConfirmationForm()
    termsConditionsForm.continue()
    termsConditionsForm.changeValues({
      terms: true,
      restrictedPayments: false,
      restrictedCountries: true,
    })
    termsConditionsForm.checkIsCurrentForm()
  })

  it('should not be able to continue to next step if Restriced Country is unticked', () => {
    const termsConditionsForm = new ConfirmationForm()
    termsConditionsForm.continue()
    termsConditionsForm.changeValues({
      terms: true,
      restrictedPayments: true,
      restrictedCountries: false,
    })
    termsConditionsForm.checkIsCurrentForm()
  })
})
