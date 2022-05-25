import { EnumAccountTypeCompanyType, EnumApplicationCurrentStep } from 'cx-api/swagger'
import { ApiHelper } from 'e2e/utils/ApiHelper'
import { CacheHelper } from 'e2e/utils/CacheHelper'
import { ApplicationBuilder } from 'e2e/utils/data/ApplicationBuilder'
import { CompanyDescriptionForm } from 'e2e/utils/forms/CompanyDescriptionForm'
import { ConfirmationForm } from 'e2e/utils/forms/ConfirmationForm'
import { ApplicationPage } from 'e2e/utils/pages/ApplicationPage'

const cache = new CacheHelper('company_description')

const values = {
  businessIndustry: 'Accounting and Corporate Sec',
  website: 'https://1234.com',
  expectedNumMonthlyPayments: '< 10',
  expectedMonthlyVolumes: 'USD < 5,000',
  expectedFxVolumes: '0%',
  expectedCurrencies: 'Euro',
  expectedOutgoingCurrencies: 'Euro',
  expectedIncomingCountries: 'China',
  expectedOutgoingCountries: 'China',
  businessModel: 'BM',
}

describe('Setup', () => {
  it('setup data', () => {
    new ApplicationBuilder()
      .withSubaddress('company_description')
      .withVerifiedEmail()
      .withAccountType(EnumAccountTypeCompanyType.C)
      .withStep(EnumApplicationCurrentStep.COMPANY_DESCRIPTION)
      .build()
      .then((result) => {
        cache.write(result)
      })
  })
})

describe('Company Description', () => {
  beforeEach(() => {
    cache.load().then((data) => {
      const { email, password } = data

      ApiHelper.changeCurrentStep(email, EnumApplicationCurrentStep.COMPANY_DESCRIPTION)

      const applicationPage = new ApplicationPage()
      applicationPage.visit({
        login: {
          email,
          password,
        },
      })

      const companyDescriptionForm = new CompanyDescriptionForm()
      companyDescriptionForm.checkIsCurrentForm()
    })
  })

  it('should not be able to continue to next step if any mandatory field empty', () => {
    const companyDescriptionForm = new CompanyDescriptionForm()
    companyDescriptionForm.continue()
    companyDescriptionForm.checkErrors({
      businessIndustry: 'Required',
      website: 'Required',
      expectedNumMonthlyPayments: 'Required',
      expectedMonthlyVolumes: 'Required',
      expectedFxVolumes: 'Required',
      expectedCurrencies: 'Required',
      expectedOutgoingCurrencies: 'Required',
      expectedIncomingCountries: 'Required',
      expectedOutgoingCountries: 'Required',
      businessModel: 'Required',
    })
  })

  it('should be able to process to next step', () => {
    const companyDescriptionForm = new CompanyDescriptionForm()
    companyDescriptionForm.changeValues(values)

    companyDescriptionForm.continue()

    companyDescriptionForm.getForm().should('not.exist')
  })

  it('should be able to update partially', () => {
    const companyDescriptionForm = new CompanyDescriptionForm()

    companyDescriptionForm.checkIsCurrentForm()
    companyDescriptionForm.checkValues(values)
    companyDescriptionForm.changeValues({
      businessModel: 'BM2',
    })
    companyDescriptionForm.continue()

    const confirmationForm = new ConfirmationForm()
    confirmationForm.back()

    companyDescriptionForm.checkValues(values)
  })

  it('should allow to enter a reason for missing website url', () => {
    const companyDescriptionForm = new CompanyDescriptionForm()

    companyDescriptionForm.checkIsCurrentForm()
    companyDescriptionForm.checkValues(values)

    companyDescriptionForm.changeValues({
      noWebsite: true,
      websiteNotProvidedReason: 'Reason',
    })

    companyDescriptionForm.continue()
    companyDescriptionForm.back()

    companyDescriptionForm.checkValues({
      noWebsite: true,
      websiteNotProvidedReason: 'Reason',
    })
  })

  it('should be able to enter a website if a reason is filled before', () => {
    const companyDescriptionForm = new CompanyDescriptionForm()

    companyDescriptionForm.checkIsCurrentForm()
    companyDescriptionForm.checkValues({
      noWebsite: true,
      websiteNotProvidedReason: 'Reason',
    })

    companyDescriptionForm.changeValues({
      noWebsite: false,
      website: 'https://1234.com',
    })

    companyDescriptionForm.continue()
    companyDescriptionForm.back()

    companyDescriptionForm.checkValues({
      noWebsite: false,
      website: 'https://1234.com',
    })
  })

  it('should not be able to enter a invalid website format', () => {
    const companyDescriptionForm = new CompanyDescriptionForm()

    companyDescriptionForm.checkIsCurrentForm()
    companyDescriptionForm.changeValues({
      website: 'https://1234.c',
    })

    companyDescriptionForm.continue()

    companyDescriptionForm.checkErrors({
      website: 'Invalid url format',
    })
  })
})
