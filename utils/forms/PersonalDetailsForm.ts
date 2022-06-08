import { BaseForm } from 'e2e/utils/forms/BaseForm'

export class PersonalDetailsForm extends BaseForm {
  getId(): string {
    return 'USER_DETAILS'
  }

  getConfigs(): any {
    return {
      dateOfBirth: { type: 'date' },
      countryOfResidence: { type: 'select' },
      nationality: { type: 'select' },
      mobileNumberCountryCode: { type: 'select' },
    }
  }
}
