export abstract class BaseForm {
  abstract getConfigs(): any
  abstract getId(): string

  fieldNameToSelector(fieldName: string) {
    return `#${fieldName.replace(/\./g, '\\.').replace(/\[/g, '\\[').replace(/]/g, '\\]')}`
  }

  checkIsCurrentForm() {
    cy.get(`#${this.getId()}`).should('be.exist')
  }

  getForm() {
    return cy.get(`#${this.getId()}`)
  }

  changeValues(values: any) {
    Object.keys(values).forEach((fieldName) => {
      const selector = this.fieldNameToSelector(fieldName)

      cy.fillField({
        ...this.getConfigs()[fieldName],
        selector,
        value: values[fieldName],
      })
    })
  }

  checkValues(values: any) {
    Object.keys(values).forEach((fieldName) => {
      const selector = this.fieldNameToSelector(fieldName)

      cy.checkField({
        ...this.getConfigs()[fieldName],
        selector,
        value: values[fieldName],
      })
    })
  }

  checkErrors(values: any) {
    Object.keys(values).forEach((fieldName) => {
      const selector = this.fieldNameToSelector(fieldName + '-error-message')

      cy.get(selector).contains(values[fieldName]).should('be.exist')
    })
  }

  continue() {
    cy.get('#continue-button').should('not.be.disabled')
    cy.get('#continue-button').click({ force: true })
  }

  back() {
    cy.get('#back-button').should('not.be.disabled')
    cy.get('#back-button').click({ force: true })
  }
}
