import { Component, Inject, OnInit } from '@angular/core';
import {
  MAT_SNACK_BAR_DATA,
  MatSnackBarRef
} from '@angular/material/snack-bar';

@Component({
  selector: 'healthe-error-snackbar',
  templateUrl: './error-snackbar.component.html',
  styleUrls: ['./error-snackbar.component.scss']
})
export class ErrorSnackbarComponent implements OnInit {
  constructor(
    @Inject(MAT_SNACK_BAR_DATA)
    public config: {
      errors: string[];
      action: string;
    },
    private _snackBarRef: MatSnackBarRef<ErrorSnackbarComponent>
  ) {}

  close() {
    this._snackBarRef.dismiss();
  }
  ngOnInit() {}
}
