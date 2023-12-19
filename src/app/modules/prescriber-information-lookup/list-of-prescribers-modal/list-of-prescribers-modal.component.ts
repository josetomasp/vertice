import {
  AfterViewInit,
  ChangeDetectorRef,
  Component,
  Inject,
  OnInit,
  ViewChild
} from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { first } from 'rxjs/operators';
import { DestroyableComponent } from '@shared/components/destroyable/destroyable.component';
import { pageSizeOptions } from '@shared';
import { HealtheDataSource } from '@shared/models/healthe-data-source';
import { MatPaginator } from '@angular/material/paginator';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ListOfPrescribersModalService } from './list-of-prescribers-modal.service';
import { Prescriber } from '@shared/models/prescriber';

@Component({
  selector: 'healthe-list-of-prescribers-modal',
  templateUrl: './list-of-prescribers-modal.component.html',
  styleUrls: ['./list-of-prescribers-modal.component.scss']
})
export class ListOfPrescribersModalComponent extends DestroyableComponent
  implements OnInit, AfterViewInit {
  @ViewChild('paginator', { static: true })
  paginator: MatPaginator = null;

  resultsData: Array<Prescriber> = [];
  result$ = new BehaviorSubject<Array<Prescriber>>([]);
  isResultLoading: boolean = true;

  // Configuration assignments
  tableColumnList: string[] = ['select', 'prescriberID', 'name', 'address'];
  pageSize: number = 10;
  pageSizeOptions = pageSizeOptions;
  tableDataSource: HealtheDataSource<any>;
  rowSelected: Prescriber;

  // End configuration assignments
  constructor(
    @Inject(MAT_DIALOG_DATA)
    public data: { NPI: string; FirstName: string; LastName: string },
    public dialogRef: MatDialogRef<ListOfPrescribersModalComponent>,
    public listOfPrescribersModalService: ListOfPrescribersModalService,
    private cd: ChangeDetectorRef
  ) {
    super();
  }

  ngOnInit() {
    this.tableDataSource = new HealtheDataSource(this.result$, null, null);
    this.tableDataSource.primaryPaginator = this.paginator;
  }

  ngAfterViewInit(): void {
    this.refreshQueue(this.data.NPI, this.data.FirstName, this.data.LastName);
  }

  refreshQueue(NPI: string, FirstName: string, LastName: string) {
    this.isResultLoading = true;
    this.resultsData = [];
    this.result$.next([]);

    if (NPI === undefined || NPI === '' || NPI == null) {
      this.listOfPrescribersModalService
        .getPrescribersData(NPI, FirstName, LastName)
        .pipe(first())
        .subscribe((realTimeRejectsQueueResults) => {
          this.resultsData = realTimeRejectsQueueResults;
          this.result$.next(realTimeRejectsQueueResults);
          this.isResultLoading = false;
          this.cd.detectChanges();
        });
    } else {
      this.listOfPrescribersModalService
        .getPrescriberById(NPI)
        .pipe(first())
        .subscribe((prescriberData) => {
          let prescriberList: Array<Prescriber>;
          if (
            prescriberData &&
            prescriberData.name !== null &&
            prescriberData.npi !== null &&
            prescriberData.firstName !== null &&
            prescriberData.primaryAltPhone !== null
          ) {
            prescriberList = [prescriberData];
            this.resultsData = prescriberList;
          }

          this.result$.next(prescriberList);
          this.isResultLoading = false;
          this.cd.detectChanges();
        });
    }
  }

  closeDialog() {
    this.dialogRef.close(this.rowSelected);
  }

  selectedRadio(element) {
    this.rowSelected = element;
  }
}
