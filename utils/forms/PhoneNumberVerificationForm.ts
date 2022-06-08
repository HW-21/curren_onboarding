import { BaseForm } from 'e2e/utils/forms/BaseForm'

export class PhoneNumberVerificationForm extends BaseForm {
  getId(): string {
    return 'VERIFY_PHONE'
  }

  getConfigs(): any {
    return {
      securityCode: { type: 'sms' },
      countryOfResidence: { type: 'select' },
      nationality: { type: 'select' },
      mobileNumberCountryCode: { type: 'select' },
    }
  }
}
