import { BaseForm } from 'e2e/utils/forms/BaseForm'

export class ConfirmationForm extends BaseForm {
  getId(): string {
    return 'TERMS_CONDITIONS'
  }

  getConfigs(): any {
    return {
      terms: { type: 'checkbox' },
      restrictedPayments: { type: 'checkbox' },
      restrictedCountries: { type: 'checkbox' },
    }
  }
}
