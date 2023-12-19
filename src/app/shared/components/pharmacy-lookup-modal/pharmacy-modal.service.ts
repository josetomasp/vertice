import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { HttpClient } from '@angular/common/http';
import { PharmacyLookupModalComponent } from './pharmacy-lookup-modal.component';
import { environment } from '../../../../environments/environment';
import { Pharmacy } from '@shared/models/pharmacy';
import { VerticeResponse } from '@shared';
import { getApiUrl } from '@shared/lib/http';

@Injectable({
  providedIn: 'root'
})
export class PharmacyModalService {
  constructor(private dialog: MatDialog, public http: HttpClient) {}

  showModal(nabp: string) {
    if (null != nabp && nabp.trim() !== '') {
      let url = getApiUrl('pharmacyLookup');
      if (environment.remote) {
        url += '/' + nabp;
      }

      this.http.get<VerticeResponse<Pharmacy>>(url).subscribe(
        (pharmacyDataResponse) => {
          this.displayModal(nabp, pharmacyDataResponse.responseBody);
        },
        (error) => {
          // Maybe do something when the lookup fails
        }
      );
    }
  }

  private displayModal(nabp: string, pharmacyData) {
    this.dialog.open(PharmacyLookupModalComponent, {
      data: { nabp, pharmacy: pharmacyData },
      autoFocus: false,
      width: '750px'
    });
  }
}
