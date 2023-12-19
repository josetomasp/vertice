import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { PrescriberLookupModalComponent } from './prescriber-lookup-modal.component';
import { HttpClient } from '@angular/common/http';
import { getApiUrl } from '../getApiUrl';
import { Prescriber } from '../store/models/prescriber';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class PrescriberModalService {
  constructor(private dialog: MatDialog, public http: HttpClient) {}

  showModal(prescriberId: string) {
    if (null != prescriberId && prescriberId.trim() !== '') {
      let url = getApiUrl('prescriberLookup');
      if (environment.remote) {
        url += '/' + prescriberId;
      }

      this.http.get<Prescriber>(url).subscribe(
        (prescriberData) => {
          this.displayModal(prescriberId, prescriberData);
        },
        (error) => {
          // Maybe do something when the lookup fails
        }
      );
    }
  }

  private displayModal(prescriberId: string, prescriberData) {
    this.dialog.open(PrescriberLookupModalComponent, {
      data: { prescriberId, prescriber: prescriberData },
      autoFocus: false,
      width: '750px'
    });
  }
}
