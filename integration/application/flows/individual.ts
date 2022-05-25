import { CacheHelper } from 'e2e/utils/CacheHelper'
import { ApplicationBuilder } from 'e2e/utils/data/ApplicationBuilder'
import { AccountTypeForm } from 'e2e/utils/forms/AccountTypeForm'
import { CompanyDescriptionForm } from 'e2e/utils/forms/CompanyDescriptionForm'
import { ConfirmationForm } from 'e2e/utils/forms/ConfirmationForm'
import { IncomingsFromGatewaysForm } from 'e2e/utils/forms/IncomingsFromGatewaysForm'
import { IncomingsFromMarketplacesForm } from 'e2e/utils/forms/IncomingsFromMarketplacesForm'
import { IncomingsFromOtherBusinessesForm } from 'e2e/utils/forms/IncomingsFromOtherBusinessesForm'
import { IncomingsFromOtherBusinessesSubForm } from 'e2e/utils/forms/IncomingsFromOtherBusinessesSubForm'
import { OperationalAddressForm } from 'e2e/utils/forms/OperationalAddressForm'
import { PersonalDetailsForm } from 'e2e/utils/forms/PersonalDetailsForm'
import { PhoneNumberVerificationForm } from 'e2e/utils/forms/PhoneNumberVerificationForm'
import { RegisteredBusinessAddressForm } from 'e2e/utils/forms/RegisteredBusinessAddressForm'
import { ResidentialAddressForm } from 'e2e/utils/forms/ResidentialAddressForm'
import { ReviewForm } from 'e2e/utils/forms/ReviewForm'
import { SoleTraderDetailsForm } from 'e2e/utils/forms/SoleTraderDetailsForm'
import { ApplicationPage } from 'e2e/utils/pages/ApplicationPage'
import reverse from 'lodash/fp/reverse'

const steps = [
  {
    form: new PersonalDetailsForm(),
    data: {
      firstName: 'FN',
      lastName: 'LN',
      dateOfBirth: '1999-09-09',
      countryOfResidence: 'Hong Kong',
      nationality: 'Hong Kong',
      mobileNumberCountryCode: '+852',
      mobileNumberNationalNumber: '90469017',
    },
    back: false,
  },
  {
    form: new PhoneNumberVerificationForm(),
    data: {
      securityCode: '+85290469017',
    },
    canUpdate: false,
  },
  {
    form: new ResidentialAddressForm(),
    data: {
      addressLine_1: 'AL1',
      addressLine_2: 'AL2',
      city: 'CT',
      stateRegionDistrict: 'SRD',
      postalCode: 'PC',
      country: 'Hong Kong',
      proofOfAddress: 'files/blank.pdf',
    },
  },
  {
    form: new AccountTypeForm(),
    data: {
      companyType: '2',
    },
  },
  {
    form: new SoleTraderDetailsForm(),
    data: {
      registrationCountry: 'China',
    },
  },
  {
    form: new RegisteredBusinessAddressForm(),
    data: {
      addressLine_1: 'AL1',
      addressLine_2: 'AL2',
      city: 'CT',
      stateRegionDistrict: 'SRD',
      postalCode: 'PC',
      country: 'Hong Kong',
    },
  },
  {
    form: new OperationalAddressForm(),
    data: {
      isSameAsRegisteredBusinessAddress: true,
    },
  },
  {
    form: new CompanyDescriptionForm(),
    data: {
      businessIndustry: 'Accounting and Corporate Sec',
      website: 'https://123.com',
      expectedNumMonthlyPayments: '< 10',
      expectedMonthlyVolumes: 'USD < 5,000',
      expectedFxVolumes: '0%',
      expectedCurrencies: 'Euro',
      expectedOutgoingCurrencies: 'Euro',
      expectedIncomingCountries: 'China',
      expectedOutgoingCountries: 'China',
      businessModel: 'BM',
    },
  },
  {
    form: new IncomingsFromMarketplacesForm(),
    data: {
      incomingsFromMarketplaces: 'No',
    },
  },
  {
    form: new IncomingsFromGatewaysForm(),
    data: {
      incomingsFromPaymentGateways: 'No',
    },
  },
  {
    form: new IncomingsFromOtherBusinessesForm(),
    data: {
      incomingsFromOtherBusinesses: 'Yes',
    },
  },
  {
    form: new IncomingsFromOtherBusinessesSubForm(0),
    back: false,
    data: {
      companyName: 'CN',
      relationship: 'P',
      placeOfIncorporation: 'China',
      description: 'D',
    },
  },
  {
    form: new ConfirmationForm(),
    data: {
      terms: true,
      restrictedPayments: true,
      restrictedCountries: true,
    },
  },
]

const cache = new CacheHelper('application_flow_individual')

describe('Application Flow - Individual', () => {
  it('setup data', () => {
    new ApplicationBuilder()
      .withSubaddress('flow_individual')
      .withVerifiedEmail()
      .build()
      .then((data) => {
        cache.write(data)
      })
  })

  it('should be able to process to correct next step', () => {
    const applicationPage = new ApplicationPage()

    cache.load().then((data) => {
      applicationPage.visit({
        login: data,
      })

      applicationPage.waitForLoading()
      applicationPage.checkIsCurrentPage()
    })

    steps.forEach((step) => {
      const form = step.form

      form.checkIsCurrentForm()
      form.changeValues(step.data)
      form.checkValues(step.data)
      form.continue()
    })
  })

  it('should be able to go back to correct previous step', () => {
    const applicationPage = new ApplicationPage()

    cache.load().then((data) => {
      applicationPage.visit({
        login: data,
      })

      applicationPage.waitForLoading()
      applicationPage.checkIsCurrentPage()
    })

    const reviewForm = new ReviewForm()

    reviewForm.checkIsCurrentForm()
    reviewForm.back()

    reverse(steps).forEach((step) => {
      if (step.canUpdate === false) {
        return
      }

      const form = step.form

      form.checkIsCurrentForm()
      form.checkValues(step.data)

      if (step.back !== false) {
        form.back()
      }
    })
  })
})
