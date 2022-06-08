import intersection from 'lodash/intersection'

export abstract class BaseEmail {
  protected emailContent: string

  protected constructor(emailContent: string) {
    this.emailContent = emailContent
  }

  protected static findBodyBySubjectAndEmail(subject: string, email: string) {
    return cy.wait(1500).then(() => {
      return cy.exec(`grep -e 'Subject: ${subject}' -rl ./logs/emails`).then((a) => {
        return cy.exec(`grep -e 'To: ${email}' -rl ./logs/emails`).then((b) => {
          const files = intersection(a.stdout.split('\n'), b.stdout.split('\n'))
          return cy.readFile(files[0]).then((body) => {
            return body
          })
        })
      })
    })
  }
}
