import { JL } from 'jsnlog';
import { ErrorHandler, Injectable } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';

@Injectable()
export class UncaughtExceptionHandler implements ErrorHandler {
  constructor() {}

  handleError(error: HttpErrorResponse) {
    const logObject: any = {
      type: 'Uncaught Exception',
      currentUrl: window.location.href,
      userAgent: navigator.userAgent
    };
    JL().fatalException(logObject, error);
  }
}
