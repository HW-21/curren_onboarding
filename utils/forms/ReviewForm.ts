import { BaseForm } from 'e2e/utils/forms/BaseForm'

export class ReviewForm extends BaseForm {
  getId(): string {
    return 'REVIEW_APPLICATION'
  }

  getConfigs(): any {
    return {}
  }
}
