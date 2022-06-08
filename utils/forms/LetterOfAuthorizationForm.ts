import { BaseForm } from 'e2e/utils/forms/BaseForm'

export class LetterOfAuthorizationForm extends BaseForm {
  getId(): string {
    return 'LETTER_OF_AUTHORIZATION'
  }

  getConfigs(): any {
    return {
      letterOfAuthorization: { type: 'file' },
    }
  }
}
