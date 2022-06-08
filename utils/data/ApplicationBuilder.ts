import { CompanyDetails, EnumAccountTypeCompanyType, EnumApplicationCurrentStep, EnumApplicationStatus, User } from 'cx-api/swagger'
import { ApiHelper } from 'e2e/utils/ApiHelper'
import { VerificationEmail } from 'e2e/utils/emails/VerificationEmail'

export class ApplicationBuilder {
  protected newUser?: boolean = true
  protected verifyEmail?: boolean
  protected applicationConfirmed?: boolean
  protected subaddress?: string
  protected service = 'GA'
  protected accountType?: EnumAccountTypeCompanyType
  protected step?: EnumApplicationCurrentStep
  protected applicationStatus?: EnumApplicationStatus
  protected user?: Partial<User>
  protected companyDetails?: Partial<CompanyDetails>
  protected locale?: string

  constructor(locale?: string) {
    this.locale = locale
    return this
  }

  withSubaddress(subaddress: string) {
    this.subaddress = subaddress?.toLowerCase()
    return this
  }

  withVerifiedEmail() {
    this.verifyEmail = true
    return this
  }

  withAccountType(accountType: EnumAccountTypeCompanyType) {
    this.accountType = accountType
    return this
  }

  withStep(step: EnumApplicationCurrentStep) {
    this.step = step
    return this
  }

  withApplicationConfirmed() {
    this.applicationConfirmed = true
    return this
  }

  withApplicationStatus(applicationStatus?: EnumApplicationStatus) {
    this.applicationStatus = applicationStatus
    return this
  }

  withNewUser(newUser: boolean) {
    this.newUser = newUser
    return this
  }

  withUserDetails(user: Partial<User>) {
    this.user = user
    return this
  }

  withCompanyDetails(companyDetails: Partial<CompanyDetails>) {
    this.companyDetails = companyDetails
    return this
  }

  build() {
    const createdAt = new Date().valueOf().toString()

    const result = {
      id: '',
      email: `${createdAt}${this.subaddress ? '+' + this.subaddress : ''}@${Cypress.env('testEmailDomain')}`,
      password: Cypress.env('testPassword'),
      createdAt,
    }

    return new Cypress.Promise((resolve) => {
      cy.wrap(1)
        .then(() => {
          if (!this.newUser) {
            return
          }

          return ApiHelper.createNewUser(
            {
              email: result.email,
              password: Cypress.env('testPassword'),
            },
            this.locale,
          )
        })
        .then(() => {
          if (!this.verifyEmail) {
            return
          }

          return VerificationEmail.findByEmail(result.email).then((v) => {
            v.verify()
            result.id = v.getVerificationDetails()['user_id']
          })
        })
        .then(() => {
          if (!this.accountType) {
            return
          }

          return ApiHelper.changeAccountType(result, this.accountType)
        })
        .then(() => {
          if (!this.user) {
            return
          }

          return ApiHelper.accountsUpdate(result, this.user)
        })
        .then(() => {
          if (!this.companyDetails) {
            return
          }

          return ApiHelper.companyDetailsUpdate(result, this.companyDetails)
        })
        .then(() => {
          if (!this.step) {
            return
          }

          return ApiHelper.changeCurrentStep(result.email, this.step)
        })
        .then(() => {
          if (!this.applicationConfirmed) {
            return
          }

          return ApiHelper.confirmUpdate(result)
        })
        .then(() => {
          if (!this.applicationStatus) {
            return
          }

          return ApiHelper.changeApplicationStatus(result.email, this.applicationStatus)
        })
        .then(() => {
          return resolve(result)
        })
    })
  }
}
