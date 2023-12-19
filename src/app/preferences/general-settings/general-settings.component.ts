import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { select, Store } from '@ngrx/store';
import { HealtheRadioGroupOption } from '@shared';
import { from, iif } from 'rxjs';
import { first, mergeMap, take, takeWhile, toArray } from 'rxjs/operators';
import { UpdateGeneralCardDirty } from '../store/actions/preferences-screen.actions';
import { DeletePreferences } from '../store/actions/preferences.actions';
import {
  ComponentType,
  Preference,
  PreferenceType,
  RootPreferencesState
} from '../store/models/preferences.models';
import { getPreferenceByQuery } from '../store/selectors/user-preferences.selectors';
import { ConfirmationModalService } from '@shared/components/confirmation-modal/confirmation-modal.service';

@Component({
  selector: 'healthe-general-settings',
  templateUrl: './general-settings.component.html',
  styleUrls: ['./general-settings.component.scss']
})
export class GeneralSettingsComponent implements OnInit, OnDestroy {
  isAlive: boolean = false;
  generalSettingsForm: FormGroup = new FormGroup({
    expanded: new FormControl(true),
    pageSize: new FormControl(25)
  });

  leftSideNavRadioOptions: Array<HealtheRadioGroupOption<boolean>> = [
    { value: false, label: 'Collapsed' },
    { value: true, label: 'Expanded' }
  ];

  globalPaginationRadioOptions: Array<HealtheRadioGroupOption<number>> = [
    { value: 10, label: '10' },
    { value: 25, label: '25' },
    { value: 50, label: '50' }
  ];

  constructor(
    public store$: Store<RootPreferencesState>,
    private confirmationModalService: ConfirmationModalService
  ) {
    this.isAlive = true;
    this.store$
      .pipe(
        takeWhile(() => this.isAlive),
        select(getPreferenceByQuery, {
          screenName: 'global',
          preferenceTypeName: PreferenceType.Expanded
        })
      )
      .subscribe((generalPreferences) => this.resetPref(generalPreferences));

    this.store$
      .pipe(
        takeWhile(() => this.isAlive),
        select(getPreferenceByQuery, {
          screenName: 'global',
          preferenceTypeName: PreferenceType.PageSize
        })
      )
      .subscribe((generalPreferences) => this.resetPref(generalPreferences));
  }

  ngOnInit() {
    this.generalSettingsForm.valueChanges.subscribe(() => {
      this.store$.dispatch(
        new UpdateGeneralCardDirty(this.generalSettingsForm.dirty)
      );
    });
  }

  ngOnDestroy() {
    this.isAlive = false;
  }

  resetToDefaults() {
    this.confirmationModalService
      .displayModal({
        titleString: 'Reset to Default?',
        bodyHtml:
          "Choosing 'yes' will reset and save your General Settings preferences to the default settings.",
        affirmString: 'Yes',
        denyString: 'No'
      })
      .afterClosed()
      .pipe(
        mergeMap((confirmed) =>
          iif(
            () => confirmed,
            from([
              {
                preferenceTypeName: PreferenceType.PageSize,
                componentTypeName: ComponentType.Paginator
              },
              {
                preferenceTypeName: PreferenceType.Expanded,
                componentTypeName: ComponentType.LeftNav
              }
            ]).pipe(
              mergeMap((preference) =>
                this.store$.pipe(
                  select(getPreferenceByQuery, {
                    screenName: 'global',
                    preferenceTypeName: preference.preferenceTypeName,
                    componentTypeName: preference.componentTypeName
                  })
                )
              ),
              take(2),
              toArray()
            )
          )
        )
      )
      .subscribe((prefs: Preference<any>[]) =>
        this.store$.dispatch(new DeletePreferences(prefs))
      );
  }

  getUpdatedPreferences(): Preference<any>[] {
    let patches = [];
    [PreferenceType.PageSize, PreferenceType.Expanded].forEach((type) => {
      if (this.generalSettingsForm.controls[type].dirty) {
        this.store$
          .pipe(
            select(getPreferenceByQuery, {
              screenName: 'global',
              preferenceTypeName: type,
              componentName: null
            }),
            first()
          )
          .subscribe((pref) => {
            pref.value = this.generalSettingsForm.controls[type].value;
            patches.push(pref);
          });
      }
    });
    return patches;
  }

  private resetPref({ preferenceTypeName, value }: Preference<any>) {
    this.generalSettingsForm.controls[preferenceTypeName].reset(value);
    this.store$.dispatch(new UpdateGeneralCardDirty(false));
  }
}
