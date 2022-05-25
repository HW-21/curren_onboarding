import { EnumAccountTypeCompanyType, EnumApplicationCurrentStep } from 'cx-api/swagger'
import { ApiHelper } from 'e2e/utils/ApiHelper'
import { CacheHelper } from 'e2e/utils/CacheHelper'
import { ApplicationBuilder } from 'e2e/utils/data/ApplicationBuilder'
import { CompanyDirectorsAndShareholdersForm } from 'e2e/utils/forms/CompanyDirectorsAndShareholdersForm'
import { CompanyVerificationForm } from 'e2e/utils/forms/CompanyVerificationForm'
import { ConfirmationForm } from 'e2e/utils/forms/ConfirmationForm'
import { ApplicationPage } from 'e2e/utils/pages/ApplicationPage'

const cache = new CacheHelper('company_verification')

const tests = [
  {
    country: 'ARE',
    values: {
      certificateOfIncorporation: 'files/blank.pdf',
      articlesOfAssociation: 'files/blank.pdf',
      certificateOfIncumbency: 'files/blank.pdf',
      businessLicense: 'files/blank.pdf',
    },
    update: {
      certificateOfIncorporation: 'files/blank.pdf',
    },
  },
  {
    country: 'AUS',
    values: {
      certificateOfIncorporation: 'files/blank.pdf',
      articlesOfAssociation: 'files/blank.pdf',
      asicCompanyExtract: 'files/blank.pdf',
    },
    update: {
      certificateOfIncorporation: 'files/blank.pdf',
    },
  },
  {
    country: 'CHN',
    values: {
      businessLicense: 'files/blank.pdf',
    },
    update: {},
  },
  {
    country: 'FRA',
    values: {
      certificateOfIncorporation: 'files/blank.pdf',
      articlesOfAssociation: 'files/blank.pdf',
      kbis: 'files/blank.pdf',
    },
    update: {
      certificateOfIncorporation: 'files/blank.pdf',
    },
  },
  {
    country: 'HKG',
    values: {
      businessRegistration: 'files/blank.pdf',
    },
    update: {},
  },
  {
    country: 'ITA',
    values: {
      certificateOfIncorporation: 'files/blank.pdf',
      articlesOfAssociation: 'files/blank.pdf',
    },
    update: {
      certificateOfIncorporation: 'files/blank.pdf',
    },
  },
  {
    country: 'ESP',
    values: {
      certificateOfIncorporation: 'files/blank.pdf',
      articlesOfAssociation: 'files/blank.pdf',
      proofCompanyShareholding: 'files/blank.pdf',
    },
    update: {
      proofCompanyShareholding: 'files/blank.pdf',
    },
  },
]

describe('Company verification', () => {
  tests.forEach(({ country, values, update }) => {
    describe(country, () => {
      before('setup data', () => {
        new ApplicationBuilder()
          .withSubaddress('company_verification_' + country)
          .withVerifiedEmail()
          .withAccountType(EnumAccountTypeCompanyType.C)
          .withCompanyDetails({
            legalCompanyName: '123',
            dateOfIncorporation: '1999-09-09' as any,
            placeOfIncorporation: country as any,
            // businessRegistrationNumber: '123456' as any,
            // businessRegistrationNumberType: 1 as any,
          })
          .withStep(EnumApplicationCurrentStep.COMPANY_VERIFICATION)
          .build()
          .then((result: any) => {
            cache.write(result)
            const applicationPage = new ApplicationPage()
            applicationPage.visit({
              login: result,
            })

            const companyVerificationForm = new CompanyVerificationForm()
            companyVerificationForm.checkIsCurrentForm()
          })
      })

      beforeEach(() => {
        cache.load().then((data) => {
          ApiHelper.changeCurrentStep(data.email, EnumApplicationCurrentStep.COMPANY_VERIFICATION)
          const applicationPage = new ApplicationPage()
          applicationPage.visit({
            login: data,
          })
        })
      })

      it('should be able to submit data', () => {
        const companyVerificationForm = new CompanyVerificationForm()
        companyVerificationForm.changeValues(values)
        companyVerificationForm.continue()

        const companyDirectorsAndShareholdersForm = new CompanyDirectorsAndShareholdersForm()
        companyDirectorsAndShareholdersForm.checkIsCurrentForm()
        companyDirectorsAndShareholdersForm.back()

        companyVerificationForm.checkValues(values)
      })

      it('should be able to update partially', () => {
        const companyVerificationForm = new CompanyVerificationForm()

        companyVerificationForm.checkIsCurrentForm()
        companyVerificationForm.checkValues(values)
        companyVerificationForm.changeValues(update)
        companyVerificationForm.continue()

        const confirmationForm = new ConfirmationForm()
        confirmationForm.back()

        companyVerificationForm.checkValues(values)
      })
    })
  })
})
