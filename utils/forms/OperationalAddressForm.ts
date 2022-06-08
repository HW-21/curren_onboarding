import { BaseForm } from 'e2e/utils/forms/BaseForm'

export class OperationalAddressForm extends BaseForm {
  getId(): string {
    return 'OPERATIONAL_ADDRESS'
  }

  getConfigs(): any {
    return {
      isSameAsRegisteredBusinessAddress: { type: 'checkbox' },
      country: { type: 'select' },
    }
  }
}
