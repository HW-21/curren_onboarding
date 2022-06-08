import { BasePage } from './BasePage'

export class SanctionedCountryPage extends BasePage {
  pathname(): string {
    return '/onboarding/cannot-signup/'
  }
}
