import {
  AfterContentInit,
  Directive,
  Input,
  OnInit,
  Self
} from '@angular/core';
import { NgControl } from '@angular/forms';
import { select, Store } from '@ngrx/store';
import { BehaviorSubject, combineLatest, of } from 'rxjs';
import { first, map, mergeMap, tap } from 'rxjs/operators';
import {
  Preference,
  preferencePathIDMatcher,
  PreferenceQuery
} from './store/models/preferences.models';
import { getPreferenceByQuery } from './store/selectors/user-preferences.selectors';
import { parsePrefPath } from './utils/parsePrefPath';

@Directive({
  selector: '[healthePref]',
  exportAs: 'healthePreference'
})
export class PrefDirective implements OnInit, AfterContentInit {
  @Input()
  healthePrefDefault: any;
  public preferenceQuery: PreferenceQuery;
  private healthePrefChanges$ = new BehaviorSubject(undefined);
  private preferenceChanges$ = this.healthePrefChanges$.pipe(
    map((value) => {
      if (typeof value === 'string' && preferencePathIDMatcher.test(value)) {
        return parsePrefPath(value);
      } else {
        return value;
      }
    }),
    tap((prefQuery) => (this.preferenceQuery = prefQuery))
  );

  constructor(private store$: Store<any>, @Self() private control: NgControl) {}

  private _healthePref: string | PreferenceQuery;

  @Input()
  set healthePref(value: string | PreferenceQuery) {
    this._healthePref = value;
    this.healthePrefChanges$.next(value);
  }

  ngOnInit(): void {
    combineLatest(this.store$, this.preferenceChanges$)
      .pipe(
        mergeMap(([store, query]) =>
          of(store).pipe(
            select(getPreferenceByQuery, query),
            map((pref) => {
              if (pref === undefined) {
                return { ...query, value: this.healthePrefDefault };
              } else {
                return pref;
              }
            })
          )
        ),
        first((pref) => {
          return !!pref && !!pref.id;
        })
      )
      .subscribe((preference: Preference<any>) => {
        if (preference && preference.value) {
          if (this.control) {
            this.control.control.setValue(preference.value);
          }
        }
      });
  }

  ngAfterContentInit(): void {}
}
