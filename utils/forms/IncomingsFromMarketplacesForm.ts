import { BaseForm } from 'e2e/utils/forms/BaseForm'

export class IncomingsFromMarketplacesForm extends BaseForm {
  getId(): string {
    return 'MARKETPLACES'
  }

  getConfigs(): any {
    return {
      incomingsFromMarketplaces: { type: 'select' },
    }
  }
}
