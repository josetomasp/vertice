import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { select, Store } from '@ngrx/store';
import {
  HealtheRadioGroupOption,
  HealtheSelectOption,
  pluckPrefValue
} from '@shared';
import { from, iif, Observable, of } from 'rxjs';
import { first, map, mergeMap, take, takeWhile, toArray } from 'rxjs/operators';
import { FeatureFlagService } from '../../customer-configs/feature-flag.service';
import {
  ACTIVITY_LABELS,
  ACTVITY_LABEL_ELEMENT_NAMES
} from '../../verbiage.service';
import { UpdateClaimViewBannerCardDirty } from '../store/actions/preferences-screen.actions';
import { DeletePreferences } from '../store/actions/preferences.actions';
import {
  bannerListQuery,
  expandedPreferenceQuery,
  Preference,
  RootPreferencesState
} from '../store/models/preferences.models';
import { getPreferenceByQuery } from '../store/selectors/user-preferences.selectors';
import { ConfirmationModalService } from '@shared/components/confirmation-modal/confirmation-modal.service';

@Component({
  selector: 'healthe-claim-view-banner-settings',
  templateUrl: './claim-view-banner-settings.component.html',
  styleUrls: ['./claim-view-banner-settings.component.scss']
})
export class ClaimViewBannerSettingsComponent implements OnInit, OnDestroy {
  componentGroupName = 'claim-view-banner-settings';
  isAlive: boolean = true;
  expandForm: FormGroup = new FormGroup({
    expanded: new FormControl()
  });

  columnForm: FormGroup = new FormGroup({
    column0: new FormControl(),
    column1: new FormControl(),
    column2: new FormControl(),
    column3: new FormControl(),
    column4: new FormControl()
  });
  expandOptions: Array<HealtheRadioGroupOption<boolean>> = [
    { value: false, label: 'Collapsed' },
    { value: true, label: 'Expanded' }
  ];

  columnList$: Observable<Array<string>> = this.store$.pipe(
    select(getPreferenceByQuery, bannerListQuery),
    pluckPrefValue,
    takeWhile(() => this.isAlive)
  );
  expanded$: Observable<Preference<boolean>> = this.store$.pipe(
    select(getPreferenceByQuery, expandedPreferenceQuery),
    pluckPrefValue,
    takeWhile(() => this.isAlive)
  );

  selectOptions$: Observable<Array<HealtheSelectOption<string>>> = of(
    Object.keys(ACTIVITY_LABELS)
  ).pipe(
    map((entries) => {
      return entries
        .map((value) => {
          if (ACTIVITY_LABELS[value]) {
            return {
              value,
              label: ACTIVITY_LABELS[value],
              elementName: ACTVITY_LABEL_ELEMENT_NAMES[value]
            };
          }
        })
        .filter(
          (option) =>
            !this.featureFlagService.shouldElementBeRemoved(
              'claim-view',
              option.elementName
            )
        );
    })
  );

  constructor(
    public store$: Store<RootPreferencesState>,
    private confirmationModalService: ConfirmationModalService,
    public featureFlagService: FeatureFlagService
  ) {}

  getCardInfo$(): Observable<
    Array<{ value: string; label: string; elementName: string }>
  > {
    const formValues = this.columnForm.getRawValue();
    const prefVal = [];
    Object.keys(formValues).forEach((key) => {
      prefVal[key.replace('column', '')] = formValues[key];
    });
    return this.selectOptions$.pipe(
      map((claimBannerOptions) => {
        return [
          {
            value: this.getOptionLabel(prefVal[0], claimBannerOptions),
            label: 'Label 1',
            elementName: this.getOptionElementName(
              prefVal[0],
              claimBannerOptions
            )
          },
          {
            value: this.getOptionLabel(prefVal[1], claimBannerOptions),
            label: 'Label 2',
            elementName: this.getOptionElementName(
              prefVal[1],
              claimBannerOptions
            )
          },
          {
            value: this.getOptionLabel(prefVal[2], claimBannerOptions),
            label: 'Label 3',
            elementName: this.getOptionElementName(
              prefVal[2],
              claimBannerOptions
            )
          },
          {
            value: this.getOptionLabel(prefVal[3], claimBannerOptions),
            label: 'Label 4',
            elementName: this.getOptionElementName(
              prefVal[3],
              claimBannerOptions
            )
          },
          {
            value: this.getOptionLabel(prefVal[4], claimBannerOptions),
            label: 'Label 5',
            elementName: this.getOptionElementName(
              prefVal[4],
              claimBannerOptions
            )
          }
        ];
      })
    );
  }

  isDisabled(value) {
    const formValues = this.columnForm.getRawValue();
    const mappedPrefVal = [];
    Object.keys(formValues).forEach((key) => {
      mappedPrefVal[key.replace('column', '')] = formValues[key];
    });
    return mappedPrefVal.indexOf(value) > -1;
  }

  getOptionLabel(value: string, options) {
    const fieldValueObj = options
      .filter((o) => o && o.value !== null)
      .find((o) => o.value === value);
    if (fieldValueObj) {
      return fieldValueObj.label;
    } else {
      return '';
    }
  }

  getOptionElementName(value: string, options) {
    const fieldValueObj = options
      .filter((o) => o && o.value !== null)
      .find((o) => o.value === value);
    if (fieldValueObj) {
      return fieldValueObj.elementName;
    } else {
      return '';
    }
  }

  ngOnInit(): void {
    /**
     * Setup store$ value listeners to set initial value and to update form after api call is made
     */
    this.columnList$.subscribe((columnList) => {
      columnList.forEach((column, i) => {
        this.columnForm.controls[`column${i}`].reset(column);
        if (i === 0) {
          this.columnForm.controls[`column${i}`].disable();
        }
      });
      this.store$.dispatch(
        new UpdateClaimViewBannerCardDirty(
          this.expandForm.dirty || this.columnForm.dirty
        )
      );
    });
    this.expanded$.subscribe((expanded) => {
      this.expandForm.controls['expanded'].reset(expanded);
      this.store$.dispatch(
        new UpdateClaimViewBannerCardDirty(
          this.expandForm.dirty || this.columnForm.dirty
        )
      );
    });
    /**
     * Setup form listeners to dispatch actions when inputs are made
     */
    this.columnForm.valueChanges.subscribe(() => {
      this.store$.dispatch(
        new UpdateClaimViewBannerCardDirty(
          this.expandForm.dirty || this.columnForm.dirty
        )
      );
    });
    this.expandForm.valueChanges.subscribe(() => {
      this.store$.dispatch(
        new UpdateClaimViewBannerCardDirty(
          this.expandForm.dirty || this.columnForm.dirty
        )
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
          "Choosing 'yes' will reset and save your Claim View Banner preferences to the default settings.",
        affirmString: 'Yes',
        denyString: 'No'
      })
      .afterClosed()
      .pipe(
        mergeMap((confirmed) =>
          iif(
            () => confirmed,
            from([bannerListQuery, expandedPreferenceQuery]).pipe(
              mergeMap((query) =>
                this.store$.pipe(select(getPreferenceByQuery, query))
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
    const patches = [];
    if (this.columnForm.dirty) {
      this.store$
        .pipe(
          select(getPreferenceByQuery, bannerListQuery),
          first()
        )
        .subscribe((columnListPreference) => {
          const formValue = this.columnForm.getRawValue();
          columnListPreference.value = [
            formValue.column0,
            formValue.column1,
            formValue.column2,
            formValue.column3,
            formValue.column4
          ];
          patches.push(columnListPreference);
        });
    }
    if (this.expandForm.dirty) {
      this.store$
        .pipe(
          select(getPreferenceByQuery, expandedPreferenceQuery),
          first()
        )
        .subscribe((expandedPreference) => {
          expandedPreference.value = this.expandForm.getRawValue().expanded;
          patches.push(expandedPreference);
        });
    }
    return patches;
  }
}
