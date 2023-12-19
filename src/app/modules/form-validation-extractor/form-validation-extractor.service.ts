import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import {
  ErrorMessage,
  FormValidationMemberLabel
} from './form-validation-extractor.models';
import { getOrdinal } from './utils/get-ordinal';

@Injectable()
export class FormValidationExtractorService {
  readonly errorMessages$: BehaviorSubject<
    ErrorMessage[]
  > = new BehaviorSubject([]);
  readonly validatorKeyToMessageMap: Map<string, string> = new Map<
    string,
    string
  >([['required', 'This field is required!']]);
  readonly formKeyToDisplayNameMap: Map<
    string,
    FormValidationMemberLabel
  > = new Map<string, string>();
  readonly formPathToElement = new Map();
  readonly errorState: Map<string, string[]> = new Map();

  constructor() {}

  /**
   * Don't use this unless you have to...
   */
  public nuke() {
    this.validatorKeyToMessageMap.clear();
    this.formKeyToDisplayNameMap.clear();
    this.errorState.clear();
    this.notifyChange();
  }

  issueErrors(inputName: string, validatorKeys: string[]) {
    this.errorState.set(inputName, [...validatorKeys]);
    this.notifyChange();
  }

  revokeAllErrors(inputName: string) {
    this.errorState.delete(inputName);
    this.notifyChange();
  }

  public registerElement(map: { [key: string]: HTMLElement }): void;

  public registerElement(key: string, element: HTMLElement): void;

  public registerElement(
    keyOrMap: string | object,
    element?: HTMLElement
  ): void {
    this.keyValueOrMapRegistration<HTMLElement>(
      keyOrMap,
      element,
      this.formPathToElement
    );
  }

  public registerFormLabel(map: {
    [key: string]: FormValidationMemberLabel;
  }): void;

  public registerFormLabel(key: string, label: FormValidationMemberLabel): void;

  public registerFormLabel(
    keyOrMap: string | object,
    label?: FormValidationMemberLabel
  ): void {
    this.keyValueOrMapRegistration(
      keyOrMap,
      label,
      this.formKeyToDisplayNameMap
    );
  }

  public registerErrorMessage(map: { [key: string]: string }): void;

  public registerErrorMessage(key: string, message: string): void;

  public registerErrorMessage(
    keyOrMap: string | object,
    message?: string
  ): void {
    this.keyValueOrMapRegistration<string>(
      keyOrMap,
      message,
      this.validatorKeyToMessageMap
    );
  }

  private formKeyDisplayNameResolver(
    formKey: string
  ): FormValidationMemberLabel {
    const index = Number(formKey);
    if (Number.isInteger(index + 1)) {
      return getOrdinal(index + 1);
    } else {
      if (this.formKeyToDisplayNameMap.has(formKey)) {
        return this.formKeyToDisplayNameMap.get(formKey);
      } else {
        return formKey;
      }
    }
  }

  private notifyChange(): void {
    this.errorMessages$.next(this.getErrorMessages());
  }

  private getErrorMessages(): ErrorMessage[] {
    const errorMessages = [];
    // tslint:disable-next-line:forin
    for (const formPathString of this.errorState.keys()) {
      const errors = this.errorState.get(formPathString);
      const element = this.formPathToElement.get(formPathString);
      const path = formPathString;
      let errorMessage;

      if (errors.length > 0) {
        const formLabels = [];
        const formPath = formPathString.split('.');

        for (let i = formPath.length; i > 0; i--) {
          formLabels.push(this.formKeyDisplayNameResolver(formPath.join('.')));
          formPath.pop();
        }

        errorMessage = `${formLabels.reverse().join(' -> ')} :: `;

        for (const errorKey of errors) {
          if (this.validatorKeyToMessageMap.has(errorKey)) {
            errorMessage += `${this.validatorKeyToMessageMap.get(errorKey)} `;
          } else {
            console.warn(`There is no message registered for '${errorKey}'!`);
            errorMessage += ` ${errorKey} `;
          }
        }
        errorMessages.push({
          for: element,
          message: errorMessage,
          path: path
        });
      }
    }
    return errorMessages;
  }

  private keyValueOrMapRegistration<T>(
    keyOrMap: string | object,
    value?: T,
    map?: Map<string, T>
  ): void {
    if (typeof keyOrMap === 'object') {
      Object.keys(keyOrMap).forEach((validationKey) => {
        map.set(validationKey, keyOrMap[validationKey]);
      });
    } else {
      map.set(keyOrMap, value);
    }
    this.notifyChange();
  }
}
