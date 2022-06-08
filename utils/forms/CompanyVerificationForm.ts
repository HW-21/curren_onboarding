import { BaseForm } from 'e2e/utils/forms/BaseForm'

export class CompanyVerificationForm extends BaseForm {
  getId(): string {
    return 'COMPANY_VERIFICATION'
  }

  getConfigs(): any {
    return {
      asicCompanyExtract: { type: 'file' },
      kbis: { type: 'file' },
      businessRegistration: { type: 'file' },
      businessLicense: { type: 'file' },
      certificateOfIncorporation: { type: 'file' },
      articlesOfAssociation: { type: 'file' },
      certificateOfIncumbency: { type: 'file' },
      proofCompanyShareholding: { type: 'file' },
    }
  }
}
