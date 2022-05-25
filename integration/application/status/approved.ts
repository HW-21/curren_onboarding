import { EnumAccountTypeCompanyType, EnumApplicationStatus } from 'cx-api/swagger'
import { CacheHelper } from 'e2e/utils/CacheHelper'
import { ApplicationBuilder } from 'e2e/utils/data/ApplicationBuilder'
import { ApplicationPage } from 'e2e/utils/pages/ApplicationPage'
import { LoginPage } from 'e2e/utils/pages/LoginPage'

const cache = new CacheHelper('approved_application')

describe('Approved Application', () => {
  it('setup data', () => {
    new ApplicationBuilder()
      .withSubaddress('approved_application')
      .withVerifiedEmail()
      .withAccountType(EnumAccountTypeCompanyType.I)
      .withApplicationConfirmed()
      .withApplicationStatus(EnumApplicationStatus.AP)
      .build()
      .then((result: any) => {
        cache.write(result)
      })
  })

  it('should redirect to webapp and show success message', () => {
    const applicationPage = new ApplicationPage()

    cache.load().then((data) => {
      applicationPage.visit({
        login: data,
      })
    })

    const loginPage = new LoginPage()

    loginPage.checkIsCurrentPage()
    loginPage.checkQueryParameter({
      action: 'onboardingSuccess',
    })
  })
})
