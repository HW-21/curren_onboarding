import { BaseForm } from 'e2e/utils/forms/BaseForm'

export class ShareholderForm extends BaseForm {
  getId(): string {
    return this.fieldNameToSelector('displayName')
  }

  private readonly index: number
  constructor(index: number) {
    super()
    this.index = index
  }

  fieldNameToSelector(fieldName: string): string {
    return super.fieldNameToSelector(`shareholders[${this.index}].${fieldName}`)
  }

  checkIsCurrentForm() {
    cy.get(this.getId()).should('be.exist')
  }

  getConfigs(): any {
    return {
      type: {
        type: 'select',
      },
      isSignupUser: {
        type: 'checkbox',
      },
      position: {
        type: 'select',
      },
      dateOfBirth: {
        type: 'date',
      },
      nationality: {
        type: 'select',
      },
      countryOfResidence: {
        type: 'select',
      },
      placeOfIncorporation: {
        type: 'select',
      },
      idDocument: {
        type: 'file',
      },
      addressProof: {
        type: 'file',
      },
    }
  }

  checkIsExisted(exist: boolean) {
    cy.get(this.fieldNameToSelector('displayName')).should(exist ? 'exist' : 'not.exist')
  }

  add() {
    cy.get('#add').click({ force: true })
  }

  getDeleteButton() {
    return cy.get(this.fieldNameToSelector('delete'))
  }

  remove() {
    this.checkIsExisted(true)
    this.getDeleteButton().click({ force: true })
  }

  save() {
    this.getSaveButton().click({ force: true })
    this.getSaveButton().should('be.disabled')
  }

  continue() {
    this.save()
  }

  getSaveButton() {
    return cy.get(this.fieldNameToSelector('save'))
  }

  checkDisplayNameText(name: string) {
    cy.get(this.fieldNameToSelector('displayName')).should('have.text', name)
  }

  checkSignupUserDisabled(disabled: boolean) {
    cy.get(this.fieldNameToSelector('isSignupUser')).should(disabled ? 'be.disabled' : 'not.be.disabled')
  }

  checkUnsavedError(errorMessage: string | boolean) {
    if (!errorMessage) {
      cy.get(this.fieldNameToSelector('id-error-message')).should('not.exist')
    } else {
      cy.get(this.fieldNameToSelector('id-error-message')).should('have.text', errorMessage)
    }
  }
}
