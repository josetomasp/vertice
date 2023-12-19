import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormControl } from '@angular/forms';
import { debounceTime, takeUntil } from 'rxjs/operators';
import { DestroyableComponent } from '@shared/components/destroyable/destroyable.component';

export interface NonParticipatingEmployersModalData {
  selectedCustomer: string;
  nonParticipatingEmployers: string[];
}

export interface StringRangeFilterPreset {
  displayedText: string;
  filterStartsWithCharacters: string[];
}

@Component({
  selector: 'healthe-non-participating-employers-modal',
  templateUrl: './non-participating-employers-modal.component.html',
  styleUrls: ['./non-participating-employers-modal.component.scss']
})
export class NonParticipatingEmployersModalComponent
  extends DestroyableComponent
  implements OnInit {
  employerNameControl: FormControl = new FormControl('');
  currentNameRangeFilterPreset: StringRangeFilterPreset;
  filteredNonParticipatingEmployerNames: string[];
  nameRangeFilterPresets: StringRangeFilterPreset[] = [
    {
      displayedText: '#-D',
      filterStartsWithCharacters: [
        '0',
        '1',
        '2',
        '3',
        '4',
        '5',
        '6',
        '7',
        '8',
        '9',
        'A',
        'B',
        'C',
        'D'
      ]
    },
    {
      displayedText: 'E-M',
      filterStartsWithCharacters: ['E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M']
    },
    {
      displayedText: 'N-S',
      filterStartsWithCharacters: ['N', 'O', 'P', 'Q', 'R', 'S']
    },
    {
      displayedText: 'T-Z',
      filterStartsWithCharacters: ['T', 'U', 'V', 'W', 'X', 'Y', 'Z']
    }
  ];

  constructor(
    @Inject(MAT_DIALOG_DATA)
    public nonParticipatingEmployersModalData: NonParticipatingEmployersModalData
  ) {
    super();
  }

  ngOnInit() {
    this.filteredNonParticipatingEmployerNames = this.nonParticipatingEmployersModalData.nonParticipatingEmployers;

    this.employerNameControl.valueChanges
      .pipe(
        takeUntil(this.onDestroy$),
        debounceTime(750)
      )
      .subscribe(() => {
        this.filterEmployerNameList();
      });
  }

  filterEmployerNameList() {
    this.filteredNonParticipatingEmployerNames = this.nonParticipatingEmployersModalData.nonParticipatingEmployers.filter(
      (employerName) => {
        if (!!this.currentNameRangeFilterPreset) {
          let doesEmployerNameMatchStartsWithFilterRange: boolean = false;
          this.currentNameRangeFilterPreset.filterStartsWithCharacters.forEach(
            (startsWithCharacter) =>
              (doesEmployerNameMatchStartsWithFilterRange =
                doesEmployerNameMatchStartsWithFilterRange ||
                employerName
                  .toLowerCase()
                  .startsWith(startsWithCharacter.toLowerCase()))
          );

          return (
            doesEmployerNameMatchStartsWithFilterRange &&
            employerName
              .toLowerCase()
              .includes(this.employerNameControl.value.toLowerCase())
          );
        } else {
          return employerName
            .toLowerCase()
            .includes(this.employerNameControl.value.toLowerCase());
        }
      }
    );
  }

  resetFilters() {
    this.currentNameRangeFilterPreset = null;
    this.employerNameControl.setValue('');
  }
}
