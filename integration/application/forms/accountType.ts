import { EnumApplicationCurrentStep } from 'cx-api/swagger'
import { ApiHelper } from 'e2e/utils/ApiHelper'
import { CacheHelper } from 'e2e/utils/CacheHelper'
import { ApplicationBuilder } from 'e2e/utils/data/ApplicationBuilder'
import { AccountTypeForm } from 'e2e/utils/forms/AccountTypeForm'
import { ApplicationPage } from 'e2e/utils/pages/ApplicationPage'

const cache = new CacheHelper('account_type')

const values = {
  companyType: '0',
}

describe('Setup', () => {
  it('setup data', () => {
    new ApplicationBuilder()
      .withSubaddress('account_type')
      .withVerifiedEmail()
      .withStep(EnumApplicationCurrentStep.ACCOUNT_TYPE)
      .build()
      .then((result) => {
        cache.write(result)
      })
  })
})

describe('Account Type', () => {
  beforeEach(() => {
    cache.load().then((data) => {
      const { email, password } = data
      ApiHelper.changeCurrentStep(email, EnumApplicationCurrentStep.ACCOUNT_TYPE)
      const applicationPage = new ApplicationPage()
      applicationPage.visit({
        login: {
          email,
          password,
        },
      })
      const accountTypeForm = new AccountTypeForm()
      accountTypeForm.checkIsCurrentForm()
    })
  })

  it('should not be able to continue to next step if not select account type', () => {
    const accountTypeForm = new AccountTypeForm()
    accountTypeForm.continue()
    accountTypeForm.checkErrors({
      companyType: 'Required',
    })
    accountTypeForm.checkIsCurrentForm()
  })

  it('should be able to process to next step', () => {
    const accountTypeForm = new AccountTypeForm()
    accountTypeForm.changeValues(values)
    accountTypeForm.continue()
    accountTypeForm.getForm().should('not.exist')
  })
})
