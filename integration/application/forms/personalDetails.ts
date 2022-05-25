import { EnumApplicationCurrentStep } from 'cx-api/swagger'
import { ApiHelper } from 'e2e/utils/ApiHelper'
import { CacheHelper } from 'e2e/utils/CacheHelper'
import { ApplicationBuilder } from 'e2e/utils/data/ApplicationBuilder'
import { PersonalDetailsForm } from 'e2e/utils/forms/PersonalDetailsForm'
import { ApplicationPage } from 'e2e/utils/pages/ApplicationPage'

const cache = new CacheHelper('personal_details')

const values = {
  firstName: 'FN',
  lastName: 'LN',
  dateOfBirth: '1999-09-09',
  countryOfResidence: 'Hong Kong',
  nationality: 'Hong Kong',
  mobileNumberCountryCode: '+852',
  mobileNumberNationalNumber: '90469017',
}

describe('Setup', () => {
  it('setup data', () => {
    new ApplicationBuilder()
      .withSubaddress('personal_details')
      .withVerifiedEmail()
      .withStep(EnumApplicationCurrentStep.USER_DETAILS)
      .build()
      .then((result) => {
        cache.write(result)
      })
  })
})

describe('Personal Details', () => {
  beforeEach(() => {
    cache.load().then((data) => {
      const { email, password } = data

      ApiHelper.changeCurrentStep(email, EnumApplicationCurrentStep.USER_DETAILS)

      const applicationPage = new ApplicationPage()
      applicationPage.visit({
        login: {
          email,
          password,
        },
      })

      const personalDetailsForm = new PersonalDetailsForm()
      personalDetailsForm.checkIsCurrentForm()
    })
  })

  it('should not be able to continue to next step if any field empty', () => {
    const personalDetailsForm = new PersonalDetailsForm()

    personalDetailsForm.continue()

    personalDetailsForm.checkErrors({
      firstName: 'Required',
      lastName: 'Required',
      dateOfBirthDay: 'Required',
      dateOfBirthMonth: 'Required',
      dateOfBirthYear: 'Required',
      countryOfResidence: 'Required',
      nationality: 'Required',
      mobileNumberCountryCode: 'Required',
      mobileNumberNationalNumber: 'Required',
    })

    personalDetailsForm.checkIsCurrentForm()
  })

  it('should be able to process to next step', () => {
    const personalDetailsForm = new PersonalDetailsForm()
    personalDetailsForm.changeValues(values)

    personalDetailsForm.continue()

    personalDetailsForm.getForm().should('not.exist')
  })

  it('should not be able to input more than 50 characters for First/Last name', () => {
    const personalDetailsForm = new PersonalDetailsForm()
    personalDetailsForm.checkValues(values)
    personalDetailsForm.changeValues({
      firstName: 'XXXXXXXXXX XXXXXXXXXX XXXXXXXXXX XXXXXXXXXX XXXXXXX',
      lastName: 'FFFFFFFFFF FFFFFFFFFF FFFFFFFFFF FFFFFFFFFF FFFFFFF',
    })

    personalDetailsForm.continue()

    personalDetailsForm.checkErrors({
      firstName: 'Too long (maximum 50)',
      lastName: 'Too long (maximum 50)',
    })
  })

  it('should not be able to continue with invalid mobile number format', () => {
    const personalDetailsForm = new PersonalDetailsForm()
    personalDetailsForm.changeValues({
      mobileNumberNationalNumber: '4a795656',
    })

    personalDetailsForm.continue()

    personalDetailsForm.checkErrors({
      mobileNumberNationalNumber: 'Invalid format. Only numbers allowed.',
    })
  })
})
