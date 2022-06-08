import { BaseForm } from 'e2e/utils/forms/BaseForm'

export class IncomingsFromOtherBusinessesSubForm extends BaseForm {
  getId(): string {
    return this.fieldNameToSelector('displayName')
  }

  private readonly index: number
  constructor(index: number) {
    super()
    this.index = index
  }

  fieldNameToSelector(fieldName: string): string {
    return super.fieldNameToSelector(`incomingBusinesses[${this.index}].${fieldName}`)
  }

  checkIsCurrentForm() {
    cy.get(this.getId()).should('be.exist')
  }

  getConfigs(): any {
    return {
      placeOfIncorporation: { type: 'select' },
    }
  }

  delete(): any {
    cy.get(this.fieldNameToSelector('delete')).click()
  }
}
