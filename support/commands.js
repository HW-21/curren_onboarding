// ***********************************************
// This example commands.js shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************
//
//
// -- This is a parent command --
// Cypress.Commands.add("login", (email, password) => { ... })
//
//
// -- This is a child command --
// Cypress.Commands.add("drag", { prevSubject: 'element'}, (subject, options) => { ... })
//
//
// -- This is a dual command --
// Cypress.Commands.add("dismiss", { prevSubject: 'optional'}, (subject, options) => { ... })
//
//
// -- This will overwrite an existing command --
// Cypress.Commands.overwrite("visit", (originalFn, url, options) => { ... })

import 'cypress-file-upload'
import 'cypress-wait-until'

Cypress.Commands.add('login', ({ username, password }) => {
  cy.visit(Cypress.env('loginUrl')).then(() => {
    cy.get('[data-test-id=username]').type(username)
    cy.get('[data-test-id=password]').type(password)
    cy.get('button').click()
    cy.url().should('eq', `${Cypress.config().baseUrl}/onboarding/application`)
  })
})

Cypress.Commands.add('adminLogin', ({ username, password }) => {
  cy.visit(Cypress.env('adminUrl')).then(() => {
    cy.get('#id_username').type(username)
    cy.get('#id_password').type(password)
    cy.get('.submit-row > input').click()
  })
})

Cypress.Commands.add('logout', () => {
  cy.clearLocalStorage()
  cy.reload()
})

/**
 * @example
 * cy.fillSelect({ selector: '#country', value: 'HK'})
 */
Cypress.Commands.add('fillSelect', ({ selector, value }) => {
  cy.get(selector).find('input').focus().type(`${value}{enter}`, { force: true })
})

/**
 * @example
 * cy.fillDate({ selector: '#dateOfBirth', date: '1990-09-09'})
 */
Cypress.Commands.add('fillDate', ({ selector, value }) => {
  const [year, month, day] = value.split('-')
  cy.get(`${selector}Day`).find('input').focus().type(`${day}{enter}`, { force: true })
  cy.get(`${selector}Month`).find('input').focus().type(`${month}{enter}`, { force: true })
  cy.get(`${selector}Year`).find('input').focus().type(`${year}{enter}`, { force: true })
})

/**
 * @example
 * cy.fillFile({ selector: '#proofOfAddress', value: 'company.json'})
 */
Cypress.Commands.add('fillFile', ({ selector, value }) => {
  cy.get(selector).attachFile(value)
})

Cypress.Commands.add('fillText', ({ selector, value }) => {
  cy.get(selector).clear().type(value)
})

Cypress.Commands.add('fillSMS', ({ selector, value }) => {
  // increase the delay to wait for backend
  return cy.wait(1500).then(() => {
    return cy
      .task('query', {
        sql: 'select security_code from sms_verification where phone_number = $1',
        values: [value],
      })
      .then(({ rows }) => {
        cy.get(selector).clear().type(rows[0].security_code)
      })
  })
})

Cypress.Commands.add('fillRadioGroup', ({ selector, value }) => {
  return cy.get(selector + '-' + value).click({ force: true })
})

Cypress.Commands.add('fillCheckbox', ({ selector, value }) => {
  if (value === false) {
    return cy.get(selector).uncheck({ force: true })
  }
  return cy.get(selector).check({ force: true })
})

Cypress.Commands.add('fillField', ({ type, ...params }) => {
  if (type === 'select') {
    return cy.fillSelect(params)
  } else if (type === 'date') {
    return cy.fillDate(params)
  } else if (type === 'file') {
    return cy.fillFile(params)
  } else if (type === 'sms') {
    return cy.fillSMS(params)
  } else if (type === 'radio' || type === 'button') {
    return cy.fillRadioGroup(params)
  } else if (type === 'checkbox') {
    return cy.fillCheckbox(params)
  } else {
    return cy.fillText(params)
  }
})

Cypress.Commands.add('checkField', ({ type, ...params }) => {
  if (type === 'select') {
    return cy.checkSelectField(params)
  } else if (type === 'date') {
    return cy.checkDateField(params)
  } else if (type === 'file') {
    return cy.checkFileField(params)
  } else if (type === 'radio') {
    return cy.checkRadioField(params)
  } else if (type === 'checkbox') {
    return cy.checkCheckboxField(params)
  } else if (type === 'text') {
    return cy.checkTextField(params)
  }
})

Cypress.Commands.add('checkTextField', ({ selector, value }) => {
  return cy.get(selector).should('have.value', value)
})

Cypress.Commands.add('checkSelectField', ({ selector, value }) => {
  return cy.get(selector + 'Container').then((element) => {
    if (element.attr('data-multi') === 'true') {
      return cy.get(selector).contains(value)
    }

    if (!value) {
      return cy.get(selector + 'Value').should('not.exist')
    }

    return cy.get(selector + 'Value').should('have.text', value)
  })
})

Cypress.Commands.add('checkDateField', ({ selector, value }) => {
  const [year, month, day] = value.split('-')

  const monthMap = {
    '01': 'January',
    '02': 'February',
    '03': 'March',
    '04': 'April',
    '05': 'May',
    '06': 'June',
    '07': 'July',
    '08': 'August',
    '09': 'September',
    10: 'October',
    11: 'November',
    12: 'December',
  }

  cy.checkSelectField({ selector: `${selector}Day`, value: Number(day) || '' })
  cy.checkSelectField({ selector: `${selector}Month`, value: monthMap[month] || '' })
  cy.checkSelectField({ selector: `${selector}Year`, value: year || '' })
})

Cypress.Commands.add('checkFileField', ({ selector, value }) => {
  return cy.get(`${selector}-name`).contains(value.split('/').slice(-1)[0].split('.')[0])
})

Cypress.Commands.add('checkRadioField', ({ selector, value }) => {
  return cy.get(`${selector}-${value}`).should('have.checked')
})

Cypress.Commands.add('checkCheckboxField', ({ selector, value }) => {
  return cy.get(`${selector}`).should(value ? 'have.checked' : 'have.not.checked')
})
