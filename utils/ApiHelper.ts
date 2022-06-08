import { AxiosRequestConfig } from 'axios'
import {
  CompanyDetails,
  EnumAccountTypeCompanyType,
  EnumApplicationStatus,
  RegisterUser,
  serviceOptions,
  TokenObtainPair,
  User,
  V2Service,
  VerifyRegistration,
} from 'cx-api/swagger'
import snakecase from 'snakecase-keys'

serviceOptions.axios = {
  // wrapping axios to cy.request
  request: (bodyConfig: AxiosRequestConfig, otherConfig: AxiosRequestConfig) => {
    const config = {
      ...bodyConfig,
      ...otherConfig,
    }
    cy.log(JSON.stringify(config))
    return new Promise((resolve) => {
      cy.request({
        ...config,
        body: snakecase(config.data, { deep: true }),
        url: Cypress.env('adminUrl') + config.url,
      }).then((res) => {
        return resolve({
          data: res.body,
        })
      })
    })
  },
} as any

// eslint-disable-next-line @typescript-eslint/no-extraneous-class
export class ApiHelper {
  static createNewUser(data: Partial<RegisterUser>, locale?: string) {
    return cy.wrap(
      V2Service.accountsRegisterCreate(
        {
          data,
        } as any,
        {
          headers: {
            'Accept-Language': locale,
          },
        },
      ),
    )
  }

  static verifyEmail(data: VerifyRegistration) {
    return cy.wrap(
      V2Service.accountsVerifyRegistrationCreate({
        data,
      }),
    )
  }

  static accountsUpdate(data: TokenObtainPair, user: Partial<User>) {
    this.getJWTToken(data).then((token) => {
      return cy.wrap(
        V2Service.accountsUpdate(
          {
            data: user as any,
          },
          {
            headers: {
              Authorization: `Bearer ${token.access}`,
            },
          },
        ),
      )
    })
  }

  static companyDetailsUpdate(data: TokenObtainPair, companyDetails: Partial<CompanyDetails>) {
    this.getJWTToken(data).then((token) => {
      return cy.wrap(
        V2Service.applicationCompanyDetailsUpdate(
          {
            data: companyDetails as any,
          },
          {
            headers: {
              Authorization: `Bearer ${token.access}`,
            },
          },
        ),
      )
    })
  }

  static changeAccountType(data: TokenObtainPair, accountType: EnumAccountTypeCompanyType) {
    this.getJWTToken(data).then((token) => {
      return cy.wrap(
        V2Service.applicationAccountTypeUpdate(
          {
            data: {
              companyType: accountType,
            },
          },
          {
            headers: {
              Authorization: `Bearer ${token.access}`,
            },
          },
        ),
      )
    })
  }

  static confirmUpdate(data: TokenObtainPair) {
    this.getJWTToken(data).then((token) => {
      return cy.wrap(
        V2Service.applicationConfirmUpdate(
          {
            data: {
              confirm: true,
            },
          },
          {
            headers: {
              Authorization: `Bearer ${token.access}`,
            },
          },
        ),
      )
    })
  }

  static getJWTToken(data: TokenObtainPair) {
    return cy.wrap(
      V2Service.loginCreate({
        data,
      }),
    )
  }

  static changeCurrentStep(email: string, step: string) {
    cy.task('query', {
      sql: `
      update applications_application
        set current_step = $2
        where user_id = (select user_id from accounts_user where email = $1)
      `,
      values: [email, step],
    })
  }

  static changeApplicationStatus(email: string, status: EnumApplicationStatus) {
    cy.task('query', {
      sql: `
      update applications_application
        set status = $2
        where user_id = (select user_id from accounts_user where email = $1)
      `,
      values: [email, status],
    })
  }
}
