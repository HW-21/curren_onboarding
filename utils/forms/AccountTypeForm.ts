import { BaseForm } from 'e2e/utils/forms/BaseForm'

export class AccountTypeForm extends BaseForm {
  getId(): string {
    return 'ACCOUNT_TYPE'
  }

  getConfigs(): any {
    return {
      companyType: { type: 'radio' },
    }
  }
}
