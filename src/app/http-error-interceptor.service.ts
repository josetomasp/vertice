import {
  HttpClient,
  HttpEvent,
  HttpHandler,
  HttpRequest
} from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, of, Subject, throwError } from 'rxjs';
import { catchError, first, throttleTime } from 'rxjs/operators';

const ADRUM = (<any>window).ADRUM;

@Injectable({
  providedIn: 'root'
})
export class HttpErrorInterceptorService {
  refreshSession: Subject<void> = new Subject<void>();

  constructor(private router: Router, private http: HttpClient) {
    this.refreshSession.pipe(throttleTime(31000)).subscribe(() => {
      this.http
        .get('/vertice-ui/vertice/assets/refreshSession.txt')
        .pipe(first())
        .subscribe();
    });
  }

  private handleHttpError(err: any): Observable<any> {
    // handle your error or rethrow
    if (err.status === 401 || err.status === 403) {
      window.location.href = 'vertice-ui/timeout/index.html';
      return of(err.message);
    }
    return throwError(err);
  }

  intercept(
    req: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    // catch the error, make specific functions for catching specific errors and you can chain through them with more catch operators
    // here use an arrow function, otherwise you may get "Cannot read property
    // 'navigate' of undefined" on angular 4.4.2/net core 2/webpack 2.70

    this.refreshSession.next();
    return next.handle(req).pipe(catchError((x) => this.handleHttpError(x)));
  }
}
