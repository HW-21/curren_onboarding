import { BaseForm } from 'e2e/utils/forms/BaseForm'

export class CompanyDescriptionForm extends BaseForm {
  getId(): string {
    return 'COMPANY_DESCRIPTION'
  }

  getConfigs(): any {
    return {
      businessIndustry: { type: 'select' },
      expectedNumMonthlyPayments: { type: 'select' },
      expectedFxVolumes: { type: 'select' },
      expectedMonthlyVolumes: { type: 'select' },
      expectedCurrencies: { type: 'select' },
      expectedOutgoingCurrencies: { type: 'select' },
      expectedIncomingCountries: { type: 'select' },
      expectedOutgoingCountries: { type: 'select' },
      noWebsite: { type: 'checkbox' },
    }
  }
}
