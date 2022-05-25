import { EnumAccountTypeCompanyType, EnumApplicationCurrentStep } from 'cx-api/swagger'
import address from 'e2e/fixtures/data/address'
import { ApiHelper } from 'e2e/utils/ApiHelper'
import { CacheHelper } from 'e2e/utils/CacheHelper'
import { ApplicationBuilder } from 'e2e/utils/data/ApplicationBuilder'
import { OperationalAddressForm } from 'e2e/utils/forms/OperationalAddressForm'
import { RegisteredBusinessAddressForm } from 'e2e/utils/forms/RegisteredBusinessAddressForm'
import { ApplicationPage } from 'e2e/utils/pages/ApplicationPage'

const cache = new CacheHelper('operational_address')

describe('Setup', () => {
  it('setup data', () => {
    new ApplicationBuilder()
      .withSubaddress('operational_address')
      .withVerifiedEmail()
      .withAccountType(EnumAccountTypeCompanyType.C)
      .withStep(EnumApplicationCurrentStep.OPERATIONAL_ADDRESS)
      .build()
      .then((result) => {
        cache.write(result)
      })
  })
})

describe('Operational Address', () => {
  before(() => {
    cache.load().then((data) => {
      const { email, password } = data

      ApiHelper.changeCurrentStep(email, EnumApplicationCurrentStep.REGISTERED_BUSINESS_ADDRESS)

      const applicationPage = new ApplicationPage()
      applicationPage.visit({
        login: {
          email,
          password,
        },
      })

      const registeredBusinessAddressForm = new RegisteredBusinessAddressForm()
      registeredBusinessAddressForm.checkIsCurrentForm()
      registeredBusinessAddressForm.changeValues(address.address1)
      registeredBusinessAddressForm.continue()
    })
  })

  beforeEach(() => {
    cache.load().then((data) => {
      const { email, password } = data

      ApiHelper.changeCurrentStep(email, EnumApplicationCurrentStep.OPERATIONAL_ADDRESS)

      const applicationPage = new ApplicationPage()
      applicationPage.visit({
        login: {
          email,
          password,
        },
      })
    })
  })

  describe('isSameAsRegisteredBusinessAddress', () => {
    it('should be able to check isSameAsRegisteredBusinessAddress if field value is the same', () => {
      const operationalAddressForm = new OperationalAddressForm()

      operationalAddressForm.checkIsCurrentForm()
      operationalAddressForm.changeValues(address.address1)
      operationalAddressForm.checkValues({
        isSameAsRegisteredBusinessAddress: true,
      })
    })

    it('should be unchecked if address is not the same', () => {
      const operationalAddressForm = new OperationalAddressForm()
      operationalAddressForm.checkIsCurrentForm()
      operationalAddressForm.changeValues(address.address2)
      operationalAddressForm.checkValues(address.address2)
    })

    it('should be able to check isSameAsRegisteredBusinessAddress', () => {
      const operationalAddressForm = new OperationalAddressForm()
      operationalAddressForm.checkIsCurrentForm()
      operationalAddressForm.changeValues(address.isSameAsRegisteredBusinessAddress)
      operationalAddressForm.checkValues(address.isSameAsRegisteredBusinessAddress)
    })
  })

  describe('submit', () => {
    it('should be able to submit without any error', () => {
      const operationalAddressForm = new OperationalAddressForm()
      operationalAddressForm.checkIsCurrentForm()
      operationalAddressForm.changeValues(address.isSameAsRegisteredBusinessAddress)
      operationalAddressForm.checkValues(address.isSameAsRegisteredBusinessAddress)
      operationalAddressForm.continue()
      operationalAddressForm.getForm().should('not.exist')
    })

    it('should be able to load initial data correctly', () => {
      const operationalAddressForm = new OperationalAddressForm()
      operationalAddressForm.checkIsCurrentForm()
      operationalAddressForm.checkValues(address.isSameAsRegisteredBusinessAddress)
    })
  })
})
