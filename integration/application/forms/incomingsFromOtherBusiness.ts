import { EnumAccountTypeCompanyType, EnumApplicationCurrentStep } from 'cx-api/swagger'
import { ApiHelper } from 'e2e/utils/ApiHelper'
import { CacheHelper } from 'e2e/utils/CacheHelper'
import { ApplicationBuilder } from 'e2e/utils/data/ApplicationBuilder'
import { CompanyVerificationForm } from 'e2e/utils/forms/CompanyVerificationForm'
import { IncomingsFromOtherBusinessesForm } from 'e2e/utils/forms/IncomingsFromOtherBusinessesForm'
import { IncomingsFromOtherBusinessesSubForm } from 'e2e/utils/forms/IncomingsFromOtherBusinessesSubForm'
import { ApplicationPage } from 'e2e/utils/pages/ApplicationPage'

const cache = new CacheHelper('b2b_incomings')

describe('Setup', () => {
  it('setup data', () => {
    new ApplicationBuilder()
      .withSubaddress('b2b_incomings')
      .withVerifiedEmail()
      .withAccountType(EnumAccountTypeCompanyType.C)
      .withStep(EnumApplicationCurrentStep.B2B)
      .build()
      .then((result) => {
        cache.write(result)
      })
  })
})

describe('Incomings from other business', () => {
  beforeEach(() => {
    cache.load().then((data) => {
      const { email, password } = data

      ApiHelper.changeCurrentStep(email, EnumApplicationCurrentStep.B2B)

      const applicationPage = new ApplicationPage()
      applicationPage.visit({
        login: {
          email,
          password,
        },
      })

      const incomingsFromOtherBusinessesForm = new IncomingsFromOtherBusinessesForm()
      incomingsFromOtherBusinessesForm.checkIsCurrentForm()
    })
  })

  it('should throw validation error if incomingsFromOtherBusinesses is null', () => {
    const incomingsFromOtherBusinessesForm = new IncomingsFromOtherBusinessesForm()

    incomingsFromOtherBusinessesForm.continue()

    incomingsFromOtherBusinessesForm.checkErrors({
      incomingsFromOtherBusinesses: 'Required',
    })
  })

  it('should have one business by default', () => {
    const incomingsFromOtherBusinessesForm = new IncomingsFromOtherBusinessesForm()
    incomingsFromOtherBusinessesForm.changeValues({
      incomingsFromOtherBusinesses: 'Yes',
    })

    const subForm = new IncomingsFromOtherBusinessesSubForm(0)
    subForm.checkIsCurrentForm()
  })

  it('should not allow to delete if only 1 item left', () => {
    const incomingsFromOtherBusinessesForm = new IncomingsFromOtherBusinessesForm()
    incomingsFromOtherBusinessesForm.changeValues({
      incomingsFromOtherBusinesses: 'Yes',
    })

    const subForm = new IncomingsFromOtherBusinessesSubForm(0)
    subForm.checkIsCurrentForm()

    subForm.changeValues({
      companyName: 'CN',
      relationship: 'P',
      placeOfIncorporation: 'China',
      description: 'D',
    })

    subForm.delete()

    subForm.checkValues({
      companyName: '',
      relationship: '',
      placeOfIncorporation: '',
      description: '',
    })
  })

  it('should be able to add items', () => {
    const incomingsFromOtherBusinessesForm = new IncomingsFromOtherBusinessesForm()
    incomingsFromOtherBusinessesForm.changeValues({
      incomingsFromOtherBusinesses: 'Yes',
    })

    incomingsFromOtherBusinessesForm.addItem()
    incomingsFromOtherBusinessesForm.addItem()

    const subForms = [
      new IncomingsFromOtherBusinessesSubForm(0),
      new IncomingsFromOtherBusinessesSubForm(1),
      new IncomingsFromOtherBusinessesSubForm(2),
    ]

    subForms[0].checkIsCurrentForm()
    subForms[1].checkIsCurrentForm()
    subForms[2].checkIsCurrentForm()
  })

  it('should process to next step', () => {
    const incomingsFromOtherBusinessesForm = new IncomingsFromOtherBusinessesForm()
    incomingsFromOtherBusinessesForm.changeValues({
      incomingsFromOtherBusinesses: 'Yes',
    })

    const subForm = new IncomingsFromOtherBusinessesSubForm(0)
    subForm.changeValues({
      companyName: 'CN',
      relationship: 'P',
      placeOfIncorporation: 'China',
      description: 'D',
    })

    incomingsFromOtherBusinessesForm.continue()

    const companyVerificationForm = new CompanyVerificationForm()
    companyVerificationForm.checkIsCurrentForm()
  })
})
