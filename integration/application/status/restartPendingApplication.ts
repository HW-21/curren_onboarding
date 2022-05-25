import { EnumAccountTypeCompanyType } from 'cx-api/swagger'
import { CacheHelper } from 'e2e/utils/CacheHelper'
import { ApplicationBuilder } from 'e2e/utils/data/ApplicationBuilder'
import { AccountTypeForm } from 'e2e/utils/forms/AccountTypeForm'
import { AdminPendingReviewApplicationPage } from 'e2e/utils/pages/AdminPendingReviewApplicationPage'
import { ApplicationPage } from 'e2e/utils/pages/ApplicationPage'

const cache = new CacheHelper('restart_pending_application')

describe('Restart pending review application', () => {
  it('setup data', () => {
    new ApplicationBuilder()
      .withSubaddress('restart_pending_application')
      .withVerifiedEmail()
      .withAccountType(EnumAccountTypeCompanyType.C)
      .withApplicationConfirmed()
      .build()
      .then((result: any) => {
        cache.write(result)

        const adminPage = new AdminPendingReviewApplicationPage(result.id)

        cy.adminLogin({
          username: 'admin@admin.com',
          password: 'adminadminadmin',
        })

        adminPage.visit({
          withDefaultLanguage: false,
        })

        adminPage.restartApplication()
        adminPage.confirmRestart()
      })
  })
  it('Application should go back to draft status', () => {
    const applicationPage = new ApplicationPage()

    cache.load().then((data) => {
      applicationPage.visit({
        login: data,
      })
    })
    applicationPage.checkIsCurrentPage()

    const companyTypeForm = new AccountTypeForm()
    companyTypeForm.checkIsCurrentForm()
  })
})
