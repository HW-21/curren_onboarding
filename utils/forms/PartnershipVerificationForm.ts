import { BaseForm } from 'e2e/utils/forms/BaseForm'

export class PartnershipVerificationForm extends BaseForm {
  getId(): string {
    return 'PARTNERSHIP_VERIFICATION'
  }

  getConfigs(): any {
    return {
      partnershipDeed: { type: 'file' },
      businessRegistration: { type: 'file' },
    }
  }
}
