import { BaseForm } from 'e2e/utils/forms/BaseForm'

export class SoleTraderDetailsForm extends BaseForm {
  getId(): string {
    return 'SOLE_TRADER_DETAILS'
  }

  getConfigs(): any {
    return {
      registrationCountry: { type: 'select' },
      registrationDocument: { type: 'file' },
    }
  }
}
