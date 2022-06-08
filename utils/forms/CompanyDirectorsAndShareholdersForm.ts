import { BaseForm } from 'e2e/utils/forms/BaseForm'

export class CompanyDirectorsAndShareholdersForm extends BaseForm {
  getId(): string {
    return 'COMPANY_SHAREHOLDERS'
  }

  getConfigs(): any {
    return {
      orgChart: { type: 'file' },
    }
  }
}
