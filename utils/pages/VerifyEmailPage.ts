import { BasePage } from './BasePage'

export class VerifyEmailPage extends BasePage {
  pathname(): string {
    return '/onboarding/verify-user/'
  }
}
