import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';

@Injectable({
  providedIn: 'root'
})
export class CopyToClipboardService {
  constructor(public snackbar: MatSnackBar) {}

  copy(div: HTMLDivElement, documentParam: Document) {
    documentParam.body.appendChild(div);
    let body: any = document.body,
      range,
      sel;
    if (documentParam.createRange && window.getSelection) {
      range = documentParam.createRange();
      sel = window.getSelection();
      sel.removeAllRanges();
      try {
        range.selectNode(div);
        sel.addRange(range);
      } catch (e) {
        range.selectNode(div);
        sel.addRange(range);
      }
    } else if (body.createTextRange) {
      range = body.createTextRange();
      range.moveToElementText(div);
      range.select();
    }
    documentParam.execCommand('copy');
    documentParam.body.removeChild(div);
    this.snackbar.open('Copied to Clipboard!', null, {
      duration: 1500,
      panelClass: ['success', 'snackbar']
    });
  }
}
