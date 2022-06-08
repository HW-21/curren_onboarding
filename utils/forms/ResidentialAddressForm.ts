import { BaseForm } from 'e2e/utils/forms/BaseForm'

export class ResidentialAddressForm extends BaseForm {
  getId(): string {
    return 'ADDRESS'
  }

  getConfigs(): any {
    return {
      country: { type: 'select' },
      proofOfAddress: { type: 'file' },
    }
  }
}
