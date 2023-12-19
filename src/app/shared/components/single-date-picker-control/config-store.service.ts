import { Injectable } from '@angular/core';
import { NgxDrpOptions } from '@healthe/vertice-library';

@Injectable()
export class ConfigStoreService {
  private defaultOptions = {
    excludeWeekends: false,
    animation: true,
    locale: 'en-US',
    fromMinMax: { fromDate: null, toDate: null },
    toMinMax: { fromDate: null, toDate: null }
  };

  constructor() {}

  private _singleDateOptions: NgxDrpOptions;

  get singleDateOptions(): NgxDrpOptions {
    return this._singleDateOptions;
  }

  set singleDateOptions(options: NgxDrpOptions) {
    this._singleDateOptions = { ...this.defaultOptions, ...options };
  }
}
