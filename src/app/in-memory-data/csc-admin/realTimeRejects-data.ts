import { RealTimeRejectsQueueResultRow } from '../../csc-administration/real-time-rejects-queue/real-time-rejects-queue-root/real-time-rejects-queue-root.component';
import { VerticeResponse } from '@shared';

export const RealTimeRejectsData: VerticeResponse<
  RealTimeRejectsQueueResultRow[]
> = {
  httpStatusCode: 200,
  errors: [],
  responseBody: [
    {
      memberId: 'C000662TRV',
      authorizationId: '12345',
      claimNumber: 'C000662',
      customerId: 'TRAVELERS',
      claimant: 'Bob Smith',
      claimantLastName: 'Smith',
      lockedBy: 'Donald Duck',
      pharmacyType: 'POS',
      pharmacyTimeZone: 'EST',
      stateOfVenue: 'FL',
      rejectCodes: ['88', 'I121', '91'],
      pharmacyLineItems: [
        {
          pharmacyName: 'WallMart',
          rejects: '88,I121',
          prescriptionName:
            'Oneprazole Cap 20 mg and some other information to make this name fairly long.',
          dateFilled: '02/01/2019',
          timeAdded: '02/02/2019 21:35:30',
          pharmacyTimeZone: 'EST'
        },
        {
          pharmacyName: 'CVS Pharmacy',
          rejects: '91,I121',
          prescriptionName: 'Vicodin Cap 20 mg',
          dateFilled: '02/01/2019',
          timeAdded: '02/02/2019 21:49:30',
          pharmacyTimeZone: 'EST'
        }
      ]
    },
    {
      memberId: 'C000663TRV',
      authorizationId: '12345',
      claimNumber: 'C000662',
      customerId: 'TRAVELERS',
      claimant: 'Sally Jones',
      claimantLastName: 'Jones',
      lockedBy: 'Daffy Duck',
      pharmacyType: 'POS',
      pharmacyTimeZone: 'CST',
      stateOfVenue: 'TX',
      rejectCodes: ['87', 'I121'],
      pharmacyLineItems: [
        {
          pharmacyName: 'Wallgreens Pharmacy',
          rejects: '87,I121',
          prescriptionName: 'Oneprazole Cap 20 mg',
          dateFilled: '02/01/2019',
          timeAdded: '02/02/2019 21:35:30',
          pharmacyTimeZone: 'CST'
        }
      ]
    },
    {
      memberId: 'C000664TRV',
      authorizationId: '12345',
      claimNumber: 'C000662',
      customerId: 'TRAVELERS',
      claimant: 'Mail Order Bob',
      claimantLastName: 'Bob',
      lockedBy: 'Donald Duck',
      pharmacyType: 'MAIL_ORDER',
      pharmacyTimeZone: 'MST',
      stateOfVenue: 'CA',
      rejectCodes: ['88', 'I121'],
      pharmacyLineItems: [
        {
          pharmacyName: 'Wallgreens Pharmacy',
          rejects: '88,I121',
          prescriptionName: 'Oneprazole Cap 20 mg',
          dateFilled: '02/01/2019',
          timeAdded: '02/02/2019 21:35:30',
          pharmacyTimeZone: 'MST'
        }
      ]
    },
    {
      memberId: 'C000665TRV',
      authorizationId: '12345',
      claimNumber: 'C000662',
      customerId: 'TRAVELERS',
      claimant: 'Bruce Wayne',
      claimantLastName: 'Wayne',
      lockedBy: 'Darkwing Duck',
      pharmacyType: 'POS',
      pharmacyTimeZone: 'EST',
      stateOfVenue: 'FL',
      rejectCodes: ['88', 'I121'],
      pharmacyLineItems: [
        {
          pharmacyName: 'Wallgreens Pharmacy',
          rejects: '88,I121',
          prescriptionName: 'Oneprazole Cap 20 mg',
          dateFilled: '02/01/2019',
          timeAdded: '02/02/2019 21:35:30',
          pharmacyTimeZone: 'EST'
        }
      ]
    }
  ]
};
