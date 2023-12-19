import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';
import { CustomerConfigs } from './customer-configs';
import { firstArrayElement, getApiUrl } from '@shared/lib';

@Injectable({
  providedIn: 'root'
})
export class CustomerConfigsService {
  constructor(private http: HttpClient) {}

  /**
   * @todo handle request error
   */
  checkerror(request) {}

  /**
   * Handle Http operation that failed.
   * Let the app continue.
   * @param operation - name of the operation that failed
   * @param result - optional value to return as the observable result
   */
  private handleError<T>(operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {
      console.error('Error calling: ' + operation);

      error = 'SERVICE ERROR - ' + operation;

      return of(error as T);
    };
  }

  getCustomerConfigs(): Observable<CustomerConfigs> {
    return this.http
      .get<CustomerConfigs>(`${getApiUrl('customerConfigs')}`, {
        observe: 'response'
      })
      .pipe(
        tap((request) => {
          this.checkerror(request);
        }),
        map((request) => request.body),
        firstArrayElement(),
        catchError<CustomerConfigs, Observable<any>>(
          this.handleError(
            '[customer-configs.service.ts] - Loading /customerConfigs',
            []
          )
        )
      );
  }
}
