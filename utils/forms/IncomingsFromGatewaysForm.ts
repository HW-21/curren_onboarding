import { BaseForm } from 'e2e/utils/forms/BaseForm'

export class IncomingsFromGatewaysForm extends BaseForm {
  getId(): string {
    return 'PAYMENT_GATEWAYS'
  }

  getConfigs(): any {
    return {
      incomingsFromPaymentGateways: { type: 'select' },
    }
  }
}
