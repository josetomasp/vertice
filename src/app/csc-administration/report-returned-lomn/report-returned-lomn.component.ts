import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ElementRef,
  EventEmitter,
  OnInit,
  Output,
  ViewChild
} from '@angular/core';
import { AbstractControl, FormControl, FormGroup } from '@angular/forms';
import { MatCheckboxChange } from '@angular/material/checkbox';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ReportReturnedLomnService } from './report-returned-lomn.service';
import { first } from 'rxjs/operators';
import { LomnQR } from './report-returned-lomn-models';

@Component({
  selector: 'healthe-report-returned-lomn',
  templateUrl: './report-returned-lomn.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  styleUrls: ['./report-returned-lomn.component.scss']
})
export class ReportReturnedLomnComponent implements OnInit {
  reportReturnedMform?: FormGroup;
  displayUploadError: boolean = false;
  pleaseUploadFileWithTIFFOrTIFExtension: string =
    '*Please upload file with TIFF or TIF extension.';
  fileUploadWasNotSuccessful: string = '*File upload was not successful.';
  uploadErrorMessage: string = this.pleaseUploadFileWithTIFFOrTIFExtension;
  disableSubmitButton: boolean = true;
  disableUploadButton: boolean = true;
  displayValidationErrorMessage: boolean = false;
  files: FileList = null;
  lomnQR: LomnQR = null;
  displayErrorMessage: boolean = false;
  isResultLoading: boolean = false;
  @Output()
  change: EventEmitter<MatCheckboxChange>;

  @ViewChild('HiddenFileInputButton', { static: true })
  hiddenFileInputButtonRef: ElementRef;
  hiddenFileInputButton: HTMLInputElement;

  constructor(
    public reportReturnedLomnService: ReportReturnedLomnService,
    public changeDetectorRef: ChangeDetectorRef,
    public snackbar: MatSnackBar
  ) {}

  ngOnInit() {
    this.hiddenFileInputButton = this.hiddenFileInputButtonRef
      .nativeElement as HTMLInputElement;

    if (null == this.reportReturnedMform) {
      this.reportReturnedMform = new FormGroup({});
      this.reportReturnedMform.addControl('qrCode', new FormControl());
    }
  }

  submit() {
    this.enableSubmitButton();

    if (!this.disableSubmitButton && !this.displayErrorMessage) {
      this.isResultLoading = true;
      this.disableSubmitButton = true;
      this.reportReturnedLomnService
        .resolveUnrecognizedLomn(
          this.files[0],
          this.reportReturnedMform.get('qrCode').value
        )
        .pipe()
        .subscribe(
          (message: any) => {
            this.isResultLoading = false;
            this.disableSubmitButton = false;
            this.snackbar.open(
              `Document has been submitted successfully!`,
              null,
              {
                duration: 2000,
                panelClass: ['success', 'snackbar', 'prewrap']
              }
            );
            this.changeDetectorRef.detectChanges();
          },
          (error: any) => {
            this.isResultLoading = false;
            this.displayUploadError = true;
            this.uploadErrorMessage = this.fileUploadWasNotSuccessful;
            this.disableSubmitButton = false;
            this.changeDetectorRef.detectChanges();
          }
        );
    }
  }
  uploadDocument(): void {
    this.hiddenFileInputButton.click();
  }
  reset(): void {
    this.displayValidationErrorMessage = false;
    this.files = null;
    this.hiddenFileInputButtonRef.nativeElement.value = '';
    this.displayErrorMessage = false;
    this.disableSubmitButton = true;
    this.disableUploadButton = true;
    this.displayUploadError = false;
    this.reportReturnedMform.controls.qrCode.setValue('');
    this.lomnQR = null;
    this.changeDetectorRef.detectChanges();
  }

  handleFileInput(event: Event) {
    this.files = (event.target as HTMLInputElement).files;
    this.enableSubmitButton();
    this.displayErrorMessage = false;
    if (
      this.lomnQR != null &&
      (this.files != null &&
        this.files.length > 0 &&
        (this.files[0].type === 'image/tif' ||
          this.files[0].type === 'image/tiff'))
    ) {
      this.displayUploadError = false;
    } else {
      this.displayUploadError = true;
      this.uploadErrorMessage = this.pleaseUploadFileWithTIFFOrTIFExtension;
      this.files = null;
    }
  }

  enableSubmitButton() {
    if (
      this.lomnQR != null &&
      (this.files != null &&
        this.files.length > 0 &&
        (this.files[0].type === 'image/tif' ||
          this.files[0].type === 'image/tiff'))
    ) {
      this.disableSubmitButton = false;
    } else {
      this.disableSubmitButton = true;
    }
  }

  validateLomn() {
    this.reportReturnedLomnService
      .lomnQRValidationByLomnId(this.reportReturnedMform.get('qrCode').value)
      .pipe(first())
      .subscribe(
        (lomnQR) => {
          this.lomnQR = lomnQR;
          this.disableUploadButton = false;
          this.displayValidationErrorMessage = false;
          this.changeDetectorRef.detectChanges();
        },
        (error: any) => {
          this.lomnQR = null;
          this.files = null;
          this.disableSubmitButton = true;
          this.disableUploadButton = true;
          this.displayValidationErrorMessage = true;
          this.hiddenFileInputButtonRef.nativeElement.value = '';
          this.changeDetectorRef.detectChanges();
        }
      );
  }

  getControl(form: FormGroup, key: string): FormControl {
    return form.get(key) as FormControl;
  }
}
