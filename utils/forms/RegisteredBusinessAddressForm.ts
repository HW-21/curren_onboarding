import { BaseForm } from 'e2e/utils/forms/BaseForm'

export class RegisteredBusinessAddressForm extends BaseForm {
  getId(): string {
    return 'REGISTERED_BUSINESS_ADDRESS'
  }

  getConfigs(): any {
    return {
      country: { type: 'select' },
    }
  }
}
