import { ContactForm } from 'e2e/utils/forms/ContactForm'
import { ContactFormPage } from 'e2e/utils/pages/ContactFormPage'

const values = {
  enquiry: 'I have a sales inquiry',
  firstName: 'Test',
  lastName: 'Test',
  email: 'test@currenxie.com',
  message: 'This is a test.',
}

describe('Contact form', () => {
  it('should not be able to continue to next step if any mandatory field empty', () => {
    const contactFormPage = new ContactFormPage()
    contactFormPage.visit()
    contactFormPage.checkIsCurrentPage()

    const contactForm = new ContactForm()
    cy.get('[type="submit"]').click({ force: true })
    contactForm.checkErrors({
      enquiry: 'Required',
      firstName: 'Required',
      lastName: 'Required',
      company: 'Required',
      email: 'Required',
      message: 'Required',
    })
  })
  it('form should have correct field labels and names', () => {
    const contactForm = new ContactForm()

    contactForm.checkFieldLabel({
      enquiryInputId: 'Enquiry',
      firstName: 'First Name',
      lastName: 'Last Name',
      company: 'Your Company',
      email: 'Email',
      message: 'Message',
    })

    contactForm.checkFieldName({
      firstName: 'firstName',
      lastName: 'lastName',
      company: 'company',
      email: 'email',
      message: 'message',
    })
    cy.get('#___gatsby').get('[name="enquiry"]').should('be.exist')
  })

  it('enquiry field should have correct values', () => {
    cy.get('#enquiryContainer').click()
    cy.get('[class$=-menu]').then(($menu) => {
      cy.wrap($menu).contains('I have a sales inquiry')
      cy.wrap($menu).contains('I have a support request')
    })
  })

  it('should be able to submit form', () => {
    const contactForm = new ContactForm()

    contactForm.changeValues(values)
    cy.get('[name="contact"]').find('[id="company"]').type('Currenxie')
    cy.get('[type="submit"]').should('not.be.disabled')
    cy.get('[type="submit"]').click({ force: true })

    //contactForm.getForm().should('not.exist')
    cy.url().should('contain', 'thanks')
  })
})
