import { ApiHelper } from 'e2e/utils/ApiHelper'

const searchParametersToObject = (search: string) => {
  const result: any = {}
  new URLSearchParams(search).forEach((value, key) => {
    result[key] = value
  })
  return result
}

interface VisitOptions {
  search?: string | any
  login?: {
    email: string
    password: string
  }
  failOnStatusCode?: boolean
  withDefaultLanguage?: boolean
}

export abstract class BasePage {
  abstract pathname(): string

  baseUrl(): string {
    return Cypress.config().baseUrl!
  }

  logout() {
    cy.get('#logout').click()
  }

  visit(options?: VisitOptions) {
    const searchParameters = options?.search
    const loginInfo = options?.login
    const failOnStatusCode = options?.failOnStatusCode

    const searchString = searchParameters
      ? typeof searchParameters === 'string'
        ? '?' + searchParameters
        : '?' + new URLSearchParams(searchParameters).toString()
      : ''

    const url =
      options?.withDefaultLanguage !== false
        ? this.baseUrl() + '/en-hk' + this.pathname() + searchString
        : this.baseUrl() + this.pathname() + searchString

    if (loginInfo) {
      return ApiHelper.getJWTToken(loginInfo).then((token) => {
        cy.visit(url, {
          onBeforeLoad: function (window) {
            window.localStorage.setItem('jwt', JSON.stringify(token))
          },
        })
      })
    } else {
      return cy.visit(url, {
        failOnStatusCode,
      })
    }
  }

  waitForLoading() {
    cy.get('#title').should('be.exist')
  }

  checkIsCurrentPage(ignoreLocale = true) {
    cy.location().should((location) => {
      let actualPath = location.pathname.replace(/\/$/, '')
      if (ignoreLocale) {
        actualPath = actualPath.replace(/^\/(en-hk|en-gb|zh-hk|zh-cn)/, '')
      }

      const expectedPath = this.pathname().replace(/\/$/, '')
      expect(actualPath).equals(expectedPath)
      expect(location.origin).equals(this.baseUrl())
    })
  }

  checkQueryParameter(parameters: any) {
    cy.location().should((location) => {
      const searchParameters = searchParametersToObject(location.search)

      Object.keys(parameters).forEach((key) => {
        expect(parameters[key], `Search parameter '${key}' should match`).equals(searchParameters[key])
      })
    })
  }

  changeLanguage(language: string) {
    cy.get('#language-switcher').click()
    cy.get(`#${language}`).click()
  }

  checkLanguage(language: string) {
    cy.location('pathname').should('contains', language.toLowerCase())
  }
}
