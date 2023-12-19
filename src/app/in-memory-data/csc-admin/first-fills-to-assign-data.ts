import { VerticeResponse } from '@shared';
import { FirstFillLineItemsToAssignResponseBody } from '../../csc-administration/assign-first-fill-to-claim/store/assign-first-fill-to-claim.reducer';

export const FIRST_FILLS_TO_ASSIGN_DATA: VerticeResponse<
  FirstFillLineItemsToAssignResponseBody
> = {
  responseBody: {
    firstFillLineItemDetails: [
      {
        firstFillTempId: '202110041977JEC',
        customer: '6000JECO',
        claimantFirstName: 'Ferdinand',
        claimantLastName: 'Kinde',
        employerName: 'OSCEOLA COUNTY SCHOOL BOARD',
        dateOfInjury: '09/08/2021',
        rxName: 'TIZANIDINE TAB 4MG',
        submittedDate: '10/04/2021'
      },
      {
        firstFillTempId: '202110041977JEC',
        customer: '6000JECO',
        claimantFirstName: 'Crocifissa',
        claimantLastName: 'Vazquez',
        employerName: 'OSCEOLA COUNTY SCHOOL BOARD',
        dateOfInjury: '11/21/2021',
        rxName: 'LIDOCAINE PAD 5%',
        submittedDate: '10/04/2021'
      },
      {
        firstFillTempId: '202110041977JEC',
        customer: '6000JECO',
        claimantFirstName: 'Jaynie',
        claimantLastName: 'Murrin',
        employerName: 'OSCEOLA COUNTY SCHOOL BOARD',
        dateOfInjury: '10/01/2021',
        rxName: 'NABUMETONE TAB 750MG',
        submittedDate: '10/04/2021'
      }
    ],
    webUserNotes:
      'These will always match for all line items\n\tamarshall 11/29/2021 - added initial notes'
  },
  errors: [],
  httpStatusCode: 200
};
// Just an example of the error response in case you need it
export const FIRST_FILLS_TO_ASSIGN_ERROR_DATA: VerticeResponse<
  FirstFillLineItemsToAssignResponseBody
> = {
  responseBody: {
    firstFillLineItemDetails: [],
    webUserNotes: null
  },
  errors: [
    'No first fill line item data found for PHI member ID: `C000662TRV`'
  ],
  httpStatusCode: 204
};
