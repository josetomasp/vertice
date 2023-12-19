import { Injectable } from '@angular/core';
import { SpecificDateControlConfigBuilder } from './specific-date-form-config';

@Injectable({
  providedIn: 'root'
})
export class SpecificDateControlConfigBuilderService {
  constructor() {}

  build(): SpecificDateControlConfigBuilder {
    return new SpecificDateControlConfigBuilder();
  }
}
