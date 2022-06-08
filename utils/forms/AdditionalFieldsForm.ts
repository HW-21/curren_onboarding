import { BaseForm } from 'e2e/utils/forms/BaseForm'

export class AdditionalFieldsForm extends BaseForm {
  private readonly index: number
  constructor(index: number) {
    super()
    this.index = index
  }

  checkIsCurrentForm() {
    return this.getSaveButton().should('be.exist')
  }

  getId(): string {
    return 'additionalInformationRequired'
  }

  getConfigs(): any {
    return {
      [`additionalInformation[${this.index}].file`]: { type: 'file' },
      [`additionalInformation[${this.index}].noFile`]: { type: 'checkbox' },
    }
  }

  getSaveButton() {
    const selector = this.fieldNameToSelector(`additionalInformation[${this.index}].save`)
    return cy.get(selector)
  }

  save() {
    this.getSaveButton().click()
  }
}
