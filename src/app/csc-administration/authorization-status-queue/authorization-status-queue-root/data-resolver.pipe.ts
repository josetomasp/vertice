import { Pipe, PipeTransform } from '@angular/core';
import { hexEncode } from '@shared';
import { AuthorizationStatusQueueRow } from './authorization-status-queue-root.component';

@Pipe({
  name: 'dataResolver'
})
export class DataResolverPipe implements PipeTransform {
  static PHARMACY_OPTION_ALL = 'All Pharmacies';
  static PHARMACY_OPTION_POS = 'POS';
  static PHARMACY_OPTION_WELLDYNE = 'Welldyne';
  static PHARMACY_WELLDYNE_NABP = 1035371;
  static PHARMACY_OPTION_WALGREENS = 'Walgreens';
  static PHARMACY_WALGREENS_NABPS = [320793, 1006899, 3813676];

  transform(
    authStatusData: any,
    selectedTabIndex: number,
    pharmacyTypeOptionsFC: string
  ): any[] {
    let selectedTabData;
    switch (selectedTabIndex) {
      default:
      case 0:
        selectedTabData = authStatusData.authRequiredPatientWaiting;
        break;
      case 1:
        selectedTabData = authStatusData.authRequired;
        break;
      case 2:
        selectedTabData = authStatusData.readyForCallApproved;
        break;
      case 3:
        selectedTabData = authStatusData.readyForCallDenied;
        break;
      case 4:
        selectedTabData = authStatusData.completed;
        break;
    }

    let tabStatus = 'AWAITING_DECISION';
    switch (selectedTabIndex) {
      case 1:
      default:
        tabStatus = 'AWAITING_DECISION';
        break;

      case 0:
        tabStatus = 'AWAITING_DECISION_PT';
        break;

      case 2:
        tabStatus = 'AWAITING_CALL';
        break;

      case 3:
        tabStatus = 'AWAITING_CALL_DENY';
        break;
      case 4:
        tabStatus = 'COMPLETE';
        break;
    }

    return selectedTabData
      .filter((authStatusRow: AuthorizationStatusQueueRow) => {
        switch (pharmacyTypeOptionsFC) {
          case DataResolverPipe.PHARMACY_OPTION_ALL:
            return true;
          case DataResolverPipe.PHARMACY_OPTION_POS:
            return !authStatusRow.mailOrder;
          case DataResolverPipe.PHARMACY_OPTION_WELLDYNE:
            return (
              authStatusRow.pharmacyNabp ===
              DataResolverPipe.PHARMACY_WELLDYNE_NABP
            );
          case DataResolverPipe.PHARMACY_OPTION_WALGREENS:
            return DataResolverPipe.PHARMACY_WALGREENS_NABPS.includes(
              authStatusRow.pharmacyNabp
            );
          default:
            return true;
        }
      })
      .map((row) => ({
        ...row,
        memberIdUrl: `claims/${hexEncode(row.customerId)}/${hexEncode(
          row.claimNumber
        )}/pbm/${hexEncode(
          row.rxAuthorizationId.toString()
        )}/pos/authorizationInformation?status=${tabStatus}`,
        claimNumberUrl: `claimview/${hexEncode(row.customerId)}/${hexEncode(
          row.claimNumber
        )}`
      }));
  }
}
