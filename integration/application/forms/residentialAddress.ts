import { EnumApplicationCurrentStep } from 'cx-api/swagger'
import { ApiHelper } from 'e2e/utils/ApiHelper'
import { CacheHelper } from 'e2e/utils/CacheHelper'
import { ApplicationBuilder } from 'e2e/utils/data/ApplicationBuilder'
import { ResidentialAddressForm } from 'e2e/utils/forms/ResidentialAddressForm'
import { ApplicationPage } from 'e2e/utils/pages/ApplicationPage'

const cache = new CacheHelper('residential_address')

const values = {
  addressLine_1: 'AL1',
  addressLine_2: 'AL2',
  city: 'CT',
  stateRegionDistrict: 'SRD',
  postalCode: 'PC',
  country: 'Hong Kong',
  proofOfAddress: 'files/LargePDF.pdf',
}

describe('Setup', () => {
  it('setup data', () => {
    new ApplicationBuilder()
      .withSubaddress('residential_address')
      .withVerifiedEmail()
      .withStep(EnumApplicationCurrentStep.ADDRESS)
      .build()
      .then((result) => {
        cache.write(result)
      })
  })
})

describe('Residential Address', () => {
  beforeEach(() => {
    cache.load().then((data) => {
      const { email, password } = data

      ApiHelper.changeCurrentStep(email, EnumApplicationCurrentStep.ADDRESS)

      const applicationPage = new ApplicationPage()
      applicationPage.visit({
        login: {
          email,
          password,
        },
      })
      const residentialAddressForm = new ResidentialAddressForm()
      residentialAddressForm.checkIsCurrentForm()
    })
  })

  it('should not be able to continue to next step if any mandatory field empty', () => {
    const residentialAddressForm = new ResidentialAddressForm()
    residentialAddressForm.continue()
    residentialAddressForm.checkErrors({
      addressLine_1: 'Required',
      city: 'Required',
      stateRegionDistrict: 'Required',
      postalCode: 'Required',
      country: 'Required',
      proofOfAddress: 'Required',
    })
    residentialAddressForm.checkIsCurrentForm()
  })

  it('should be able to process to next step with PDF in large size', () => {
    const residentialAddressForm = new ResidentialAddressForm()
    residentialAddressForm.changeValues(values)
    residentialAddressForm.continue()
    residentialAddressForm.getForm().should('not.exist')
  })
})
