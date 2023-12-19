import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import {
  CreateNewAuthorizationModalComponent,
  CreateNewAuthorizationModalComponentData
} from './create-new-authorization-modal.component';

@Injectable({
  providedIn: 'root'
})
export class CreateNewAuthorizationModalService {
  constructor(private dialog: MatDialog) {}

  public showModal(dialogData: CreateNewAuthorizationModalComponentData) {
    this.dialog.open(CreateNewAuthorizationModalComponent, {
      data: dialogData,
      autoFocus: false,
      width: '750px',
      height: '565px'
    });
  }
}
