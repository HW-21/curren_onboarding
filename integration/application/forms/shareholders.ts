import { EnumAccountTypeCompanyType, EnumApplicationCurrentStep } from 'cx-api/swagger'
import { ApiHelper } from 'e2e/utils/ApiHelper'
import { CacheHelper } from 'e2e/utils/CacheHelper'
import { ApplicationBuilder } from 'e2e/utils/data/ApplicationBuilder'
import { CompanyDirectorsAndShareholdersForm } from 'e2e/utils/forms/CompanyDirectorsAndShareholdersForm'
import { ConfirmationForm } from 'e2e/utils/forms/ConfirmationForm'
import { LetterOfAuthorizationForm } from 'e2e/utils/forms/LetterOfAuthorizationForm'
import { ShareholderForm } from 'e2e/utils/forms/ShareholderForm'
import { ApplicationPage } from 'e2e/utils/pages/ApplicationPage'

const cache = new CacheHelper('shareholders')

describe('Setup', () => {
  it('setup data', () => {
    new ApplicationBuilder()
      .withSubaddress('shareholders')
      .withVerifiedEmail()
      .withUserDetails({
        firstName: 'FN',
        lastName: 'LN',
        dateOfBirth: '1999-09-09' as any,
        countryOfResidence: 'HKG' as any,
        nationality: 'HKG' as any,
        mobileNumber: '+85290469017',
      })
      .withAccountType(EnumAccountTypeCompanyType.C)
      .withStep(EnumApplicationCurrentStep.COMPANY_SHAREHOLDERS)
      .build()
      .then((result) => {
        cache.write(result)
      })
  })
})

describe('Shareholders', () => {
  beforeEach(() => {
    const applicationPage = new ApplicationPage()

    cache.load().then((data) => {
      applicationPage.visit({
        login: data,
      })

      const companyDirectorsAndShareholdersForm = new CompanyDirectorsAndShareholdersForm()
      companyDirectorsAndShareholdersForm.checkIsCurrentForm()
    })
  })

  describe('Create', () => {
    it('should have 1 unsaved shareholder', () => {
      const shareholderForm = new ShareholderForm(0)
      shareholderForm.checkIsExisted(true)
    })

    it('should not be able to save incomplete Individual shareholder', () => {
      const shareholderForm = new ShareholderForm(0)

      shareholderForm.changeValues({ type: 'Individual' })
      shareholderForm.getSaveButton().click()
      shareholderForm.getSaveButton().should('not.be.disabled')
      shareholderForm.checkErrors({
        position: 'Required',
        firstName: 'Required',
        lastName: 'Required',
        dateOfBirthDay: 'Required',
        dateOfBirthMonth: 'Required',
        dateOfBirthYear: 'Required',
        countryOfResidence: 'Required',
        nationality: 'Required',
        idDocument: 'Required',
        addressProof: 'Required',
      })
    })

    it('should not be able to save incomplete Company shareholder', () => {
      const shareholderForm = new ShareholderForm(0)

      shareholderForm.changeValues({ type: 'Company' })
      shareholderForm.getSaveButton().click()
      shareholderForm.getSaveButton().should('not.be.disabled')
      shareholderForm.checkErrors({
        companyName: 'Required',
        placeOfIncorporation: 'Required',
        percentageOfSharesHeld: 'Required',
      })
    })

    it('should be able to add an individual signup shareholder', () => {
      const shareholder = {
        type: 'Individual',
        isSignupUser: true,
        position: 'Shareholder',
        percentageOfSharesHeld: '1.01',
      }
      const shareholderForm = new ShareholderForm(0)

      shareholderForm.changeValues(shareholder)
      shareholderForm.checkValues(shareholder)
      shareholderForm.save()
      shareholderForm.checkDisplayNameText('FN LN')
    })

    it('should be able to add an non signup individual shareholder', () => {
      const shareholder = {
        type: 'Individual',
        firstName: 'FN',
        lastName: 'LN',
        dateOfBirth: '1999-09-09',
        position: 'Shareholder',
        nationality: 'Hong Kong',
        countryOfResidence: 'Hong Kong',
        idDocument: 'files/blank.pdf',
        addressProof: 'files/blank.pdf',
        percentageOfSharesHeld: '1.01',
      }

      const shareholderForm = new ShareholderForm(1)

      shareholderForm.add()
      shareholderForm.changeValues(shareholder)
      shareholderForm.checkValues(shareholder)
      shareholderForm.save()
      shareholderForm.checkDisplayNameText('FN LN')
    })

    it('should be able to add a company shareholder', () => {
      const shareholder = {
        type: 'Company',
        companyName: 'companyName',
        percentageOfSharesHeld: '1.02',
        placeOfIncorporation: 'China',
      }

      const shareholderForm = new ShareholderForm(2)

      shareholderForm.add()
      shareholderForm.changeValues(shareholder)
      shareholderForm.checkValues(shareholder)
      shareholderForm.save()
      shareholderForm.checkDisplayNameText(shareholder.companyName)
    })
  })

  describe('Save Button State', () => {
    it('should disable the button if form is submitted and not dirty', () => {
      new ShareholderForm(0).getSaveButton().should('be.disabled')
      new ShareholderForm(1).getSaveButton().should('be.disabled')
      new ShareholderForm(2).getSaveButton().should('be.disabled')
    })

    it('should enable the button if some of the value is changed', () => {
      const shareholderForms = [new ShareholderForm(0), new ShareholderForm(1), new ShareholderForm(2)]

      shareholderForms[0].changeValues({
        percentageOfSharesHeld: '2.00',
      })
      shareholderForms[0].getSaveButton().should('not.be.disabled')

      shareholderForms[1].changeValues({
        percentageOfSharesHeld: '2.01',
      })
      shareholderForms[1].getSaveButton().should('not.be.disabled')

      shareholderForms[2].changeValues({
        percentageOfSharesHeld: '2.01',
      })
      shareholderForms[2].getSaveButton().should('not.be.disabled')
    })
  })

  describe('Update', () => {
    it('should be able to update a signup shareholder', () => {
      const shareholderForm = new ShareholderForm(0)
      const values = {
        percentageOfSharesHeld: '3.00',
      }

      shareholderForm.changeValues(values)
      shareholderForm.save()
      shareholderForm.checkValues(values)
    })

    it('should be able to update a non signup shareholder', () => {
      const values = {
        percentageOfSharesHeld: '3.00',
      }

      const shareholderForm = new ShareholderForm(1)

      shareholderForm.changeValues(values)
      shareholderForm.save()
      shareholderForm.checkValues(values)
    })

    it('should be able to update a company shareholder', () => {
      const values = {
        companyName: 'new company name',
      }

      const shareholderForm = new ShareholderForm(2)

      shareholderForm.changeValues(values)
      shareholderForm.save()
      shareholderForm.checkValues(values)

      shareholderForm.checkDisplayNameText(values.companyName)
    })
  })

  describe('Signup user State', () => {
    it('should be able to uncheck signup user checkbox', () => {
      const shareholderForm = new ShareholderForm(0)

      shareholderForm.changeValues({ isSignupUser: true })
      shareholderForm.checkSignupUserDisabled(false)
    })

    it('should disable all signup user checkbox if there is 1 already', () => {
      const shareholderForms = [new ShareholderForm(0), new ShareholderForm(1)]

      shareholderForms[1].checkSignupUserDisabled(true)
      shareholderForms[0].changeValues({ isSignupUser: false })
      shareholderForms[1].checkSignupUserDisabled(false)

      shareholderForms[1].changeValues({ isSignupUser: true })
      shareholderForms[0].checkSignupUserDisabled(true)
    })

    it('should clear the value correctly', () => {
      const shareholderForm = new ShareholderForm(0)

      shareholderForm.changeValues({ isSignupUser: false })

      shareholderForm.checkValues({
        type: 'Individual',
        isSignupUser: false,
        position: 'Shareholder',
        percentageOfSharesHeld: '1.01',
        firstName: '',
        lastName: '',
        dateOfBirth: '',
        countryOfResidence: '',
        nationality: '',
      })
    })
  })

  describe('Continue', () => {
    it('should not process to next step if shareholder is not saved', () => {
      const companyDirectorsAndShareholdersForm = new CompanyDirectorsAndShareholdersForm()
      const shareholderForms = [new ShareholderForm(0), new ShareholderForm(1), new ShareholderForm(2)]

      shareholderForms[0].changeValues({
        percentageOfSharesHeld: '5.00',
      })
      shareholderForms[1].changeValues({
        percentageOfSharesHeld: '5.01',
      })
      shareholderForms[2].changeValues({
        percentageOfSharesHeld: '5.02',
      })

      // should not exist before it is submitted
      shareholderForms[0].checkUnsavedError(false)
      shareholderForms[1].checkUnsavedError(false)
      shareholderForms[2].checkUnsavedError(false)

      companyDirectorsAndShareholdersForm.continue()

      shareholderForms[0].checkUnsavedError('Please save before continuing')
      shareholderForms[1].checkUnsavedError('Please save before continuing')
      shareholderForms[2].checkUnsavedError('Please save before continuing')
    })

    it('should be able to process to letter of authorization step', () => {
      const companyDirectorsAndShareholdersForm = new CompanyDirectorsAndShareholdersForm()
      const nextForm = new LetterOfAuthorizationForm()

      companyDirectorsAndShareholdersForm.checkIsCurrentForm()
      companyDirectorsAndShareholdersForm.continue()

      nextForm.checkIsCurrentForm()

      cache.load().then((data) => {
        ApiHelper.changeCurrentStep(data.email, 'COMPANY_SHAREHOLDERS')
      })
    })

    it('should be able to process to confirmation step', () => {
      const companyDirectorsAndShareholdersForm = new CompanyDirectorsAndShareholdersForm()
      const nextForm = new ConfirmationForm()
      const shareholderForm = new ShareholderForm(0)

      companyDirectorsAndShareholdersForm.checkIsCurrentForm()
      shareholderForm.changeValues({
        percentageOfSharesHeld: '25.00',
      })
      shareholderForm.save()
      shareholderForm.getSaveButton().should('be.disabled')

      companyDirectorsAndShareholdersForm.continue()
      nextForm.checkIsCurrentForm()

      cache.load().then((data) => {
        ApiHelper.changeCurrentStep(data.email, 'COMPANY_SHAREHOLDERS')
      })
    })
  })

  describe('Delete', () => {
    const shareholderForms = [new ShareholderForm(0), new ShareholderForm(1), new ShareholderForm(2)]

    it('Should be able to delete company shareholder', () => {
      shareholderForms[2].remove()
      shareholderForms[2].checkIsExisted(false)
    })

    it('Should be able to delete individual non signup shareholder', () => {
      shareholderForms[1].remove()
      shareholderForms[1].checkIsExisted(false)
    })

    it('Should disable the button since it is the last shareholder in the form', () => {
      shareholderForms[0].getDeleteButton().should('be.disabled')
    })
  })
})
