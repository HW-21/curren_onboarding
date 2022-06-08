import { BaseForm } from 'e2e/utils/forms/BaseForm'

export class ContactForm extends BaseForm {
  getId(): string {
    return 'CONTACT'
  }

  getConfigs(): any {
    return {
      enquiry: { type: 'select' },
    }
  }

  checkFieldLabel(values: any) {
    Object.keys(values).forEach((fieldLabel) => {
      cy.get('#___gatsby')
        .find('label[for=' + fieldLabel + ']')
        .contains(values[fieldLabel])
        .should('be.exist')
    })
  }

  checkFieldName(values: any) {
    Object.keys(values).forEach((fieldId) => {
      cy.get('#___gatsby')
        .get('[name="contact"]')
        .find('#' + fieldId)
        .invoke('attr', 'name')
        .should('eq', values[fieldId])
    })
  }
}
