import { EnumAccountTypeCompanyType } from 'cx-api/swagger'
import { CacheHelper } from 'e2e/utils/CacheHelper'
import { ApplicationBuilder } from 'e2e/utils/data/ApplicationBuilder'
import { AdminPendingReviewApplicationPage } from 'e2e/utils/pages/AdminPendingReviewApplicationPage'
import { AdminRejectedApplicationPage } from 'e2e/utils/pages/AdminRejectedApplicationPage'
import { ApplicationPage } from 'e2e/utils/pages/ApplicationPage'

const cache = new CacheHelper('send_to_pending_review')

describe('Send to pending review', () => {
  it('setup data', () => {
    new ApplicationBuilder()
      .withSubaddress('send_to_pending_review')
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

        adminPage.rejectApplication()
        adminPage.inputReason()
        adminPage.confirmReject()

        const adminRejectPage = new AdminRejectedApplicationPage(result.id)
        adminRejectPage.visit({
          withDefaultLanguage: false,
        })

        adminRejectPage.sendToPendingReview()
        adminRejectPage.confirmSendToPendingReview()
      })
  })
  it('Application should go back to pending status', () => {
    const applicationPage = new ApplicationPage()

    cache.load().then((data) => {
      applicationPage.visit({
        login: data,
      })
    })
    applicationPage.checkIsCurrentPage()
    cy.contains('Our team is reviewing your application! We’ll email you as soon as it’s time for the next step.')
  })
})
