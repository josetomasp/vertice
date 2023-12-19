import { Injectable } from '@angular/core';
import { BehaviorSubject, Subject } from 'rxjs';
import { FormArray, FormGroup } from '@angular/forms';

@Injectable({
  providedIn: 'root'
})
export class CreateNewAuthorizationService {
  private formArray: FormArray = new FormArray([]);

  public formIsValid$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(
    false
  );
  public showErrors$: Subject<void> = new Subject();
  public saveFormData$: Subject<void> = new Subject();
  public reloadAuthItems$: Subject<void> = new Subject();

  public reset() {
    this.formArray = new FormArray([]);
    this.formIsValid$ = new BehaviorSubject<boolean>(false);
    this.formArray.statusChanges.subscribe((value) => {
      this.formIsValid$.next(this.formArray.valid);
    });
  }

  public addFormGroup(fg: FormGroup) {
    this.formArray.push(fg);
  }

  constructor() {}
}
