import { EnumAccountTypeCompanyType, EnumApplicationCurrentStep } from 'cx-api/swagger'
import { CacheHelper } from 'e2e/utils/CacheHelper'
import { ApplicationBuilder } from 'e2e/utils/data/ApplicationBuilder'
import { AdditionalFieldsForm } from 'e2e/utils/forms/AdditionalFieldsForm'
import { AdditionalInformationPage } from 'e2e/utils/pages/AdditionalInformationPage'
import { AdminPendingReviewApplicationPage } from 'e2e/utils/pages/AdminPendingReviewApplicationPage'
import { ApplicationPendingReviewPage } from 'e2e/utils/pages/ApplicationPendingReviewPage'

const fieldsData = {
  admin: {
    username: 'compliance@test.xyz',
    password: 'Test@1234',
  },
  additionalInfo: [
    { type: 'Q', text: 'Question Label', response: 'Question Response' },
    { type: 'F', text: 'File Label', response: 'files/blank.pdf', noFile: false },
    { type: 'F', text: "File Label (Don't have)", noFile: true, otherComments: '123' },
  ],
}

const cache = new CacheHelper('application_additional_information')

describe('Additional Information', () => {
  it('setup data', () => {
    new ApplicationBuilder()
      .withSubaddress('additional_information')
      .withVerifiedEmail()
      .withAccountType(EnumAccountTypeCompanyType.C)
      .withStep(EnumApplicationCurrentStep.COMPANY_VERIFICATION)
      .withApplicationConfirmed()
      .build()
      .then((result: any) => {
        cache.write(result)

        const adminPage = new AdminPendingReviewApplicationPage(result.id)

        cy.adminLogin({
          username: 'compliance@test.xyz',
          password: 'Test@1234',
        })

        adminPage.visit({
          withDefaultLanguage: false,
        })

        fieldsData.additionalInfo.forEach(({ text, type }, index) => {
          adminPage.addAdditionalInformation()
          adminPage.fillAdditionalInformation(index, type, text)
        })

        adminPage.saveAdditionalInformation()
      })
  })

  describe('Forms', () => {
    beforeEach(() => {
      const additionalInformationPage = new AdditionalInformationPage()
      cache.load().then((data) => {
        additionalInformationPage.visit({
          login: data,
        })

        additionalInformationPage.waitForLoading()
        additionalInformationPage.checkIsCurrentPage()
      })
    })

    it('Should be able to submit a question field', () => {
      const additionalFieldsForm = new AdditionalFieldsForm(0)
      additionalFieldsForm.changeValues({
        ['additionalInformation[0].response']: fieldsData.additionalInfo[0].response,
      })
      additionalFieldsForm.getSaveButton().should('not.be.disabled')
      additionalFieldsForm.save()
      additionalFieldsForm.getSaveButton().should('be.disabled')
    })

    it('should be able to upload a file', () => {
      const additionalFieldsForm = new AdditionalFieldsForm(1)

      additionalFieldsForm.changeValues({
        ['additionalInformation[1].noFile']: false,
        ['additionalInformation[1].file']: 'files/blank.pdf',
      })

      additionalFieldsForm.getSaveButton().should('not.be.disabled')
      additionalFieldsForm.save()
      additionalFieldsForm.getSaveButton().should('be.disabled')
    })

    it('should be able to provide a reason for not having the file', () => {
      const additionalFieldsForm = new AdditionalFieldsForm(2)

      additionalFieldsForm.changeValues({
        ['additionalInformation[2].noFile']: true,
        ['additionalInformation[2].otherComments']: 'Comments',
      })

      additionalFieldsForm.getSaveButton().should('not.be.disabled')
      additionalFieldsForm.save()
      additionalFieldsForm.getSaveButton().should('be.disabled')
    })

    it('should be enable or disable the save buttons correctly', () => {
      const additionalInformationPage = new AdditionalInformationPage()

      cache.load().then((data) => {
        additionalInformationPage.visit({
          login: data,
        })

        additionalInformationPage.waitForLoading()
        additionalInformationPage.checkIsCurrentPage()
      })

      const additionalFieldsForms = [new AdditionalFieldsForm(0), new AdditionalFieldsForm(1), new AdditionalFieldsForm(2)]

      // all the data are submitted before
      additionalInformationPage.checkConfirmButton(false)
      additionalFieldsForms[0].getSaveButton().should('be.disabled')
      additionalFieldsForms[1].getSaveButton().should('be.disabled')
      additionalFieldsForms[2].getSaveButton().should('be.disabled')

      // change it to new value and see if the buttons are disabled correctly
      additionalFieldsForms[0].changeValues({
        ['additionalInformation[0].response']: 'new',
      })
      additionalFieldsForms[0].getSaveButton().should('not.be.disabled')
      additionalInformationPage.checkConfirmButton(true)

      // change it back to default value
      additionalFieldsForms[0].changeValues({
        ['additionalInformation[0].response']: fieldsData.additionalInfo[0].response,
      })
      additionalFieldsForms[0].getSaveButton().should('be.disabled')
      additionalInformationPage.checkConfirmButton(false)

      // change it to new value and see if the buttons are disabled correctly
      additionalFieldsForms[1].changeValues({
        ['additionalInformation[1].noFile']: true,
        ['additionalInformation[1].otherComments']: 'c',
      })
      additionalFieldsForms[1].getSaveButton().should('not.be.disabled')
      additionalInformationPage.checkConfirmButton(true)

      // change it back to default value
      additionalFieldsForms[1].changeValues({
        ['additionalInformation[1].noFile']: false,
      })
      additionalFieldsForms[1].getSaveButton().should('be.disabled')
      additionalInformationPage.checkConfirmButton(false)

      // change it to new value and see if the buttons are disabled correctly
      additionalFieldsForms[2].changeValues({
        ['additionalInformation[2].noFile']: false,
        ['additionalInformation[2].file']: 'files/blank.pdf',
      })
      additionalFieldsForms[2].getSaveButton().should('not.be.disabled')
      additionalInformationPage.checkConfirmButton(true)

      // change it back to default value
      additionalFieldsForms[2].changeValues({
        ['additionalInformation[2].noFile']: true,
      })
      additionalFieldsForms[2].getSaveButton().should('be.disabled')
      additionalInformationPage.checkConfirmButton(false)
    })

    it('should be able to update the file field correctly', () => {
      const additionalFieldsForms = [new AdditionalFieldsForm(0), new AdditionalFieldsForm(1), new AdditionalFieldsForm(2)]

      additionalFieldsForms[1].changeValues({
        ['additionalInformation[1].noFile']: true,
        ['additionalInformation[1].otherComments']: 'c',
      })
      additionalFieldsForms[1].save()
      additionalFieldsForms[1].getSaveButton().should('be.disabled')

      additionalFieldsForms[2].changeValues({
        ['additionalInformation[2].noFile']: false,
        ['additionalInformation[2].file']: 'files/blank.pdf',
      })
      additionalFieldsForms[2].save()
      additionalFieldsForms[2].getSaveButton().should('be.disabled')
    })

    it('should be able to submit the additional info', () => {
      const additionalInformationPage = new AdditionalInformationPage()

      additionalInformationPage.checkConfirmButton(false)
      additionalInformationPage.confirm()

      const applicationPendingReviewPage = new ApplicationPendingReviewPage()
      applicationPendingReviewPage.checkIsCurrentPage()
    })
  })
})
