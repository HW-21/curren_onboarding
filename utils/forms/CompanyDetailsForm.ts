import { BaseForm } from 'e2e/utils/forms/BaseForm'

export class CompanyDetailsForm extends BaseForm {
  getId(): string {
    return 'COMPANY_DETAILS'
  }

  getConfigs(): any {
    return {
      placeOfIncorporation: { type: 'select' },
      dateOfIncorporation: { type: 'date' },
      // businessRegistrationNumberType: { type: 'select' },
    }
  }
}
