import { EnumAccountTypeCompanyType, EnumApplicationCurrentStep } from 'cx-api/swagger'
import { ApiHelper } from 'e2e/utils/ApiHelper'
import { CacheHelper } from 'e2e/utils/CacheHelper'
import { ApplicationBuilder } from 'e2e/utils/data/ApplicationBuilder'
import { CompanyDetailsForm } from 'e2e/utils/forms/CompanyDetailsForm'
import { ApplicationPage } from 'e2e/utils/pages/ApplicationPage'
import { SanctionedCountryPage } from 'e2e/utils/pages/SanctionedCountryPage'

const cache = new CacheHelper('company_details')

describe('Setup', () => {
  it('setup data', () => {
    new ApplicationBuilder()
      .withSubaddress('company_details')
      .withVerifiedEmail()
      .withAccountType(EnumAccountTypeCompanyType.C)
      .withStep(EnumApplicationCurrentStep.COMPANY_DETAILS)
      .build()
      .then((result) => {
        cache.write(result)
      })
  })
})

describe('Company Details', () => {
  beforeEach(() => {
    cache.load().then((data) => {
      const { email, password } = data

      ApiHelper.changeCurrentStep(email, EnumApplicationCurrentStep.COMPANY_DETAILS)

      const applicationPage = new ApplicationPage()
      applicationPage.visit({
        login: {
          email,
          password,
        },
      })

      const companyDetailsForm = new CompanyDetailsForm()
      companyDetailsForm.checkIsCurrentForm()
    })
  })

  it('should not be able to continue to next step if any mandatory field empty', () => {
    const companyDetailsForm = new CompanyDetailsForm()
    companyDetailsForm.continue()
    companyDetailsForm.checkErrors({
      placeOfIncorporation: 'Required',
      legalCompanyName: 'Required',
      dateOfIncorporationDay: 'Required',
      dateOfIncorporationMonth: 'Required',
      dateOfIncorporationYear: 'Required',
      // businessRegistrationNumber: 'Required',
      // businessRegistrationNumberType: 'Required',
    })
  })

  it('should be able to process to next step', () => {
    const companyDetailsForm = new CompanyDetailsForm()
    companyDetailsForm.changeValues({
      placeOfIncorporation: 'HK',
      legalCompanyName: 'LCN',
      dateOfIncorporation: '1999-09-09',
      // businessRegistrationNumber: '123456',
      // businessRegistrationNumberType: 'Company Registration Number',
    })

    companyDetailsForm.continue()

    companyDetailsForm.getForm().should('not.exist')
  })

  it('should be able to redirect to sanctioned country page if country is not allowed', () => {
    const companyDetailsForm = new CompanyDetailsForm()
    companyDetailsForm.changeValues({
      placeOfIncorporation: 'Iran',
      legalCompanyName: 'LCN',
      dateOfIncorporation: '1999-09-09',
      // businessRegistrationNumber: '123456',
      // businessRegistrationNumberType: 'Company Registration Number',
    })

    companyDetailsForm.continue()

    const sanctionedCountryPage = new SanctionedCountryPage()
    sanctionedCountryPage.checkIsCurrentPage()

    // check if history.state works
    cy.contains('Iran').should('be.exist')
  })
})
