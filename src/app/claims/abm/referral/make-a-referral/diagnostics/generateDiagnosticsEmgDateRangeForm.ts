import { FormControl, FormGroup, Validators } from '@angular/forms';

export function generateDiagnosticsEmgDateRangeForm() {
  return new FormGroup({
    bodyParts: new FormControl([], [Validators.required]),
    serviceDate: new FormControl(null),
    notes: new FormControl(null)
  });
}
