import { BaseForm } from 'e2e/utils/forms/BaseForm'

export class IncomingsFromOtherBusinessesForm extends BaseForm {
  getId(): string {
    return 'B2B'
  }

  getConfigs(): any {
    return {
      incomingsFromOtherBusinesses: { type: 'select' },
    }
  }

  addItem() {
    cy.get('#add').click({ force: true })
  }
}
