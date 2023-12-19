import { Injectable } from '@angular/core';
import {
  MatSnackBar,
  MatSnackBarRef,
  SimpleSnackBar
} from '@angular/material/snack-bar';
import { ErrorSnackbarComponent } from '@shared/components/error-snackbar/error-snackbar.component';

@Injectable({
  providedIn: 'root'
})
export class HealtheSnackBarService {
  private _snackBarRef: MatSnackBarRef<any>;

  constructor(private snackBar: MatSnackBar) {}

  showInfo(
    message: string,
    action = 'OK',
    duration: 3000
  ): MatSnackBarRef<SimpleSnackBar> {
    this._snackBarRef = this.snackBar.open(message, action, {
      duration,
      panelClass: ['snackbar', 'success']
    });
    return this._snackBarRef;
  }

  showSuccess(
    message: string,
    action = 'OK',
    duration = 3000
  ): MatSnackBarRef<SimpleSnackBar> {
    this._snackBarRef = this.snackBar.open(message, action, {
      duration,
      panelClass: ['snackbar', 'success']
    });
    return this._snackBarRef;
  }

  showError(
    errors: string[],
    action = 'X',
    duration = 10000
  ): MatSnackBarRef<ErrorSnackbarComponent> {
    this._snackBarRef = this.snackBar.openFromComponent(
      ErrorSnackbarComponent,
      {
        panelClass: ['snackbar', 'danger'],
        duration,
        data: { errors, action }
      }
    );
    return this._snackBarRef;
  }
}
