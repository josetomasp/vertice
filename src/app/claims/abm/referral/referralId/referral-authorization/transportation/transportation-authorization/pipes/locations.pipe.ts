import { Pipe, PipeTransform } from '@angular/core';
import {
  referralLocationToFullString
} from 'src/app/claims/abm/referral/make-a-referral/make-a-referral-shared';
import {
  ClaimLocation
} from 'src/app/claims/abm/referral/store/models/make-a-referral.models';

@Pipe({
  name: 'locationLabel'
})
export class LocationLabel implements PipeTransform {
  transform(value: ClaimLocation): string {
    return referralLocationToFullString(value);
  }
}
