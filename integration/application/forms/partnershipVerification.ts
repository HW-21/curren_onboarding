import { EnumAccountTypeCompanyType, EnumApplicationCurrentStep } from 'cx-api/swagger'
import { ApiHelper } from 'e2e/utils/ApiHelper'
import { CacheHelper } from 'e2e/utils/CacheHelper'
import { ApplicationBuilder } from 'e2e/utils/data/ApplicationBuilder'
import { ConfirmationForm } from 'e2e/utils/forms/ConfirmationForm'
import { PartnershipVerificationForm } from 'e2e/utils/forms/PartnershipVerificationForm'
import { ApplicationPage } from 'e2e/utils/pages/ApplicationPage'

const tests = [
  {
    country: 'HKG',
    values: {
      partnershipDeed: 'files/blank.pdf',
      businessRegistration: 'files/blank.pdf',
    },
    update: {
      partnershipDeed: 'files/blank.pdf',
    },
  },
  {
    country: 'CHN',
    values: {
      partnershipDeed: 'files/blank.pdf',
    },
    update: {
      partnershipDeed: 'files/blank.pdf',
    },
  },
]

const cache = new CacheHelper('partnership_verification')

describe('Partnership verification', () => {
  tests.forEach(({ country, values, update }) => {
    describe(country, () => {
      before('setup data', () => {
        new ApplicationBuilder()
          .withSubaddress('partnership_verification_' + country)
          .withVerifiedEmail()
          .withAccountType(EnumAccountTypeCompanyType.P)
          .withCompanyDetails({
            legalCompanyName: '123',
            dateOfIncorporation: '1999-09-09' as any,
            placeOfIncorporation: country as any,
            // businessRegistrationNumber: '123456' as any,
            // businessRegistrationNumberType: 1 as any,
          })
          .withStep(EnumApplicationCurrentStep.PARTNERSHIP_VERIFICATION)
          .build()
          .then((result: any) => {
            cache.write(result)
            const applicationPage = new ApplicationPage()
            applicationPage.visit({
              login: result,
            })

            const partnershipVerificationForm = new PartnershipVerificationForm()
            partnershipVerificationForm.checkIsCurrentForm()
          })
      })

      beforeEach(() => {
        cache.load().then((data) => {
          ApiHelper.changeCurrentStep(data.email, EnumApplicationCurrentStep.PARTNERSHIP_VERIFICATION)
          const applicationPage = new ApplicationPage()
          applicationPage.visit({
            login: data,
          })
        })
      })

      it('should be able to submit data', () => {
        const partnershipVerificationForm = new PartnershipVerificationForm()
        partnershipVerificationForm.checkIsCurrentForm()

        partnershipVerificationForm.changeValues(values)

        partnershipVerificationForm.continue()

        const confirmationForm = new ConfirmationForm()
        confirmationForm.checkIsCurrentForm()
        confirmationForm.back()

        partnershipVerificationForm.checkValues(values)
      })

      it('should be able to update partially', () => {
        const partnershipVerificationForm = new PartnershipVerificationForm()

        partnershipVerificationForm.checkIsCurrentForm()
        partnershipVerificationForm.checkValues(values)
        partnershipVerificationForm.changeValues(update)
        partnershipVerificationForm.continue()

        const confirmationForm = new ConfirmationForm()
        confirmationForm.back()

        partnershipVerificationForm.checkValues(values)
      })
    })
  })
})
