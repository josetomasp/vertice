import { Injectable } from '@angular/core';
import {
  faCity,
  faMapMarker,
  faPlane,
  IconDefinition
} from '@fortawesome/pro-light-svg-icons';
import { flatten } from 'lodash';
import { Observable, Observer, zip } from 'rxjs';
import { concatAll, map, take, toArray } from 'rxjs/operators';
import AutocompletePrediction = google.maps.places.AutocompletePrediction;
import AutocompleteService = google.maps.places.AutocompleteService;
import AutocompletionRequest = google.maps.places.AutocompletionRequest;
import PlaceResult = google.maps.places.PlaceResult;
import PlacesService = google.maps.places.PlacesService;
import PlacesServiceStatus = google.maps.places.PlacesServiceStatus;
import TextSearchRequest = google.maps.places.TextSearchRequest;

export interface AutocompleteOption {
  value: string;
  icon: IconDefinition;
}

@Injectable({
  providedIn: 'root'
})
export class LocationService {
  autocompleteService: AutocompleteService;
  placesService: PlacesService;

  constructor() {
    this.autocompleteService = new AutocompleteService();
    this.placesService = new PlacesService(document.createElement('div'));
  }

  getAirportOptions(value: string): Observable<AutocompleteOption[]> {
    return this.getAirportPlaces(value).pipe(
      map((results) => {
        return results.map(({ name }) => ({ value: name, icon: faPlane }));
      })
    );
  }

  getAllOptions(value: string): Observable<AutocompleteOption[]> {
    return this.getAllSuggestions(value).pipe(
      map((results) => {
        return results.map((obj) => ({
          value: obj.description,
          icon: faMapMarker
        }));
      })
    );
  }

  getCityOptions(value: string): Observable<AutocompleteOption[]> {
    // TODO: Build support for city only search if needed
    // this.getCitySuggestions(value).pipe(
    //   map((results) => {
    //     console.log(results);
    //     return results.map(({ name }) => ({ value: name, icon: faPlane }));
    //   })
    // );
    console.warn(
      'PLEASE ADD SUPPORT FOR CITIES ONLY SEARCH IN location.service.ts'
    );
    return null;
  }

  getCitiesAndAirportsOptions(value: string) {
    return zip(
      this.getCitySuggestions(value).pipe(
        map((results) => {
          return results.map((obj) => ({
            value: obj.description,
            icon: faCity
          }));
        })
      ),
      this.getAirportPlaces(value).pipe(
        map((results) => {
          return results.map((obj) => ({ value: obj.name, icon: faPlane }));
        }),
        concatAll(),
        take(5),
        toArray()
      )
    ).pipe(
      map((results) => {
        return flatten(results);
      })
    );
  }

  getCitySuggestions(value: string): Observable<AutocompletePrediction[]> {
    return this.autocompleteSearch({
      input: value,
      types: ['(cities)'],
      componentRestrictions: { country: 'us' }
    });
  }

  getAllSuggestions(value: string): Observable<AutocompletePrediction[]> {
    return this.autocompleteSearch({
      input: value,
      componentRestrictions: { country: 'us' }
    });
  }

  getAirportPlaces(value: string): Observable<PlaceResult[]> {
    return this.textSearch({ query: value, type: 'airport' });
  }

  getOptionsWithAddresses(address: string): Observable<AutocompleteOption[]> {
    return this.autocompleteSearch({
      input: address,
      componentRestrictions: { country: 'us' },
      types: ['address']
    }).pipe(
      map((results) => {
        return results.map((obj) => ({
          value: obj.description,
          icon: faMapMarker
        }));
      })
    );
  }

  getPlacesFromAddress(address: string): Observable<PlaceResult[]> {
    return this.textSearch({ query: address });
  }

  private autocompleteSearch(
    request: AutocompletionRequest
  ): Observable<AutocompletePrediction[]> {
    return Observable.create((observer: Observer<AutocompletePrediction[]>) => {
      this.autocompleteService.getPlacePredictions(
        request,
        (result: AutocompletePrediction[], status) => {
          if (status === PlacesServiceStatus.OK) {
            observer.next(result);
          } else if (status === PlacesServiceStatus.ZERO_RESULTS) {
            observer.next([]);
          } else {
            observer.error(status);
          }
          observer.complete();
        }
      );
    });
  }

  private textSearch(request: TextSearchRequest): Observable<PlaceResult[]> {
    return Observable.create((observer: Observer<PlaceResult[]>) => {
      this.placesService.textSearch(
        request,
        (result: PlaceResult[], status) => {
          if (status === PlacesServiceStatus.OK) {
            observer.next(result);
          } else if (status === PlacesServiceStatus.ZERO_RESULTS) {
            observer.next([]);
          } else {
            observer.error(status);
          }
          observer.complete();
        }
      );
    });
  }

  public getAddressComponentsForPlace(
    googlePlaceId: string
  ): Observable<PlaceResult> {
    return Observable.create((observer: Observer<PlaceResult>) => {
      this.placesService.getDetails(
        { placeId: googlePlaceId, fields: ['address_component'] },
        (result: PlaceResult, status: PlacesServiceStatus) => {
          if (status === PlacesServiceStatus.OK) {
            observer.next(result);
          } else if (
            status === PlacesServiceStatus.ZERO_RESULTS ||
            status === PlacesServiceStatus.NOT_FOUND
          ) {
            observer.next(null);
          } else {
            observer.error(status);
          }
        }
      );
    });
  }
}
