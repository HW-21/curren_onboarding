import { ApiHelper } from 'e2e/utils/ApiHelper'
import { searchParametersToObject } from 'hooks/useSearchParameter'

import { BaseEmail } from './BaseEmail'

export class VerificationEmail extends BaseEmail {
  static TITLE_MAP = {
    en: 'Welcome to Currenxie',
    'zh-hant': '\n' + ' =?utf-8?b?Q3VycmVueGll5q2h6L+O5oKoIC0g6KuL6amX6K2J5oKo55qE6Zu75a2Q6YO15Lu2?=',
  }

  static findByEmail(email: string, locale = 'en') {
    return this.findBodyBySubjectAndEmail(this.TITLE_MAP[locale], email).then((body) => {
      return new VerificationEmail(body)
    })
  }

  getVerificationLink(): string {
    return /\nhttp.*8000\/(.*)/.exec(this.emailContent)?.[1] ?? ''
  }

  getVerificationDetails() {
    const url = this.getVerificationLink()

    if (url.endsWith('=')) {
      return searchParametersToObject(atob(url.split('/')[2]))
    }

    const searchParameters = url.split('?')[1]
    return searchParametersToObject(searchParameters)
  }

  visitVerificationLink() {
    return cy.visit(Cypress.config().baseUrl + '/' + this.getVerificationLink())
  }

  verify() {
    return ApiHelper.verifyEmail(this.getVerificationDetails())
  }
}
