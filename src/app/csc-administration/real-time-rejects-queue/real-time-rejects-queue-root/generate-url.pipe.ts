import { Pipe, PipeTransform } from '@angular/core';
import {
  RealTimeRejectsQueueResultRow
} from './real-time-rejects-queue-root.component';
import { hexEncode } from '@shared';

@Pipe({
  name: 'generateUrl'
})
export class GenerateUrlPipe implements PipeTransform {

  transform(row: RealTimeRejectsQueueResultRow): string {
    const customerId = hexEncode(row.customerId);
    const claimNumber = hexEncode(row.claimNumber);
    const authorizationId = hexEncode(row.authorizationId);

    return `claims/${customerId}/${claimNumber}/pbm/${authorizationId}/rtr/rtrPromotion`;
  }

}
