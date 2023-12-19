import { IcdCodeSet } from '../claim-view/store/models/icd-codes.models';

export const IcdCodesData: IcdCodeSet = {
  status: 'OK',
  messages: [],
  icds: [
    {
      icdCode: '100',
      icdVersion: '9',
      icdCodeId: 1224,
      icdDescription: 'LEPTOSPIROSIS',
      icdSpecificityCode: 'I',
      activeFlag: 'Y',
      compensabilityDescription: 'Active'
    },
    {
      icdCode: 'A00',
      icdVersion: '10',
      icdCodeId: 18844,
      icdDescription: 'Cholera',
      icdSpecificityCode: '0',
      activeFlag: 'Y',
      compensabilityDescription: 'Active'
    },
    {
      icdCode: '010.03',
      icdVersion: '9',
      icdCodeId: 100,
      icdDescription:
        'PRIMARY TUBERCULOUS COMPLEX TUBERCLE BACILLI FOUND (IN SPUTUM) BY MICROSCOPY',
      icdSpecificityCode: 'C',
      activeFlag: 'Y',
      compensabilityDescription: ''
    },
    {
      icdCode: '011.86',
      icdVersion: '9',
      icdCodeId: 200,
      icdDescription:
        'OTHER SPECIFIED PULMONARY TUBERCULOSIS TUBERCLE BACILLI NOT FOUND BY BACTERIOLOGICAL OR HISTOLOGICAL EXAMINATION BUT TUBERCULOSIS CONFIRMED BY OTHER METHODS (INOCULATION OF ANIMALS)',
      icdSpecificityCode: 'C',
      activeFlag: 'Y',
      compensabilityDescription: ''
    }
  ]
};
