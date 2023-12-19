import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { HealtheDataSource } from '@shared/models/healthe-data-source';
import { SelectionModel } from '@angular/cdk/collections';
import { oneValueRequiredValidator } from '@shared';
import {
  DrugLookupService,
  OtherMedicationSearchResult
} from '@shared/service/drug-lookup.service';
import { first } from 'rxjs/operators';
import {
  TableCondition,
  VerbiageService
} from '../../../../../../verbiage.service';

@Component({
  selector: 'healthe-other-medication-search-modal',
  templateUrl: './other-medication-search-modal.component.html',
  styleUrls: ['./other-medication-search-modal.component.scss']
})
export class OtherMedicationSearchModalComponent implements OnInit {
  displayedColumns: string[] = [
    'select',
    'ndc',
    'prescriptionName',
    'strength'
  ];
  isLoading: boolean = false;
  // This is used for leaving the search button enabled regardless of validations until the user clicks it once
  isSearchClickedOnce: boolean = false;

  otherMedicationFormGroup: FormGroup = new FormGroup(
    {
      drugNdc: new FormControl(null),
      drugName: new FormControl(null)
    },
    oneValueRequiredValidator(Validators.required, ['drugNdc', 'drugName'])
  );

  dataSource = new HealtheDataSource<OtherMedicationSearchResult>([]);

  selectedPrescription = new SelectionModel<OtherMedicationSearchResult>(
    false,
    null
  );
  noDataForQueryVerbiage: any;

  constructor(
    private drugLookupService: DrugLookupService,
    protected verbiageService: VerbiageService
  ) {
    this.noDataForQueryVerbiage = verbiageService.getTableVerbiage(
      TableCondition.NoOtherMedicationData
    );
  }

  ngOnInit() {}

  searchForPrescriptions() {
    this.isSearchClickedOnce = true;
    if (!this.disableSearchButton()) {
      this.isLoading = true;
      this.dataSource = new HealtheDataSource<OtherMedicationSearchResult>([]);

      this.drugLookupService
        .getOtherMedications(
          this.otherMedicationFormGroup.get('drugNdc').value,
          this.otherMedicationFormGroup.get('drugName').value
        )
        .pipe(first())
        .subscribe((otherMedicationSearchResponse) => {
          this.dataSource = new HealtheDataSource<OtherMedicationSearchResult>(
            otherMedicationSearchResponse.responseBody
          );
          this.isLoading = false;
        });
    }
  }

  disableSearchButton(): boolean {
    return (
      this.isSearchClickedOnce &&
      this.otherMedicationFormGroup.hasError('hasNoValues')
    );
  }
}
