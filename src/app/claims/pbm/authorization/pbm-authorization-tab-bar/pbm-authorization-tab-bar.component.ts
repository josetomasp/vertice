import { Component, OnInit, ViewChild } from '@angular/core';
import { MatTabGroup } from '@angular/material/tabs';
import { ActivatedRoute, Router } from '@angular/router';
import { select, Store } from '@ngrx/store';
import { first, map, takeUntil } from 'rxjs/operators';
import { RootState } from '../../../../store/models/root.models';
import { getPathSegments } from '../../../../store/selectors/router.selectors';
import {
  DestroyableComponent
} from '@shared/components/destroyable/destroyable.component';

@Component({
  selector: 'healthe-authorization-tab-bar',
  templateUrl: './pbm-authorization-tab-bar.component.html',
  styleUrls: ['./pbm-authorization-tab-bar.component.scss']
})
export class PbmAuthorizationTabBarComponent extends DestroyableComponent implements OnInit {
  @ViewChild(MatTabGroup, { static: true }) tabGroup: MatTabGroup;

  tabs = [
    {
      link: 'authorizationInformation',
      label: 'Authorization Information'
    },
    {
      link: 'prescriptions',
      label: 'Prescription History'
    },
    {
      link: 'clinical',
      label: 'Clinical History'
    },
    {
      link: 'documents',
      label: 'Documents'
    }
  ];

  constructor(
    public router: Router,
    public activatedRoute: ActivatedRoute,
    public store$: Store<RootState>
  ) {
    super();
  }

  ngOnInit() {
    this.store$
      .pipe(select(getPathSegments))
      .pipe(takeUntil(this.onDestroy$),
        map((path) => path.pop())
      )
      .subscribe((screenLocation) => {
        this.tabGroup.selectedIndex = this.tabs.findIndex(
          (tab) => tab.link === screenLocation
        );
      });
  }

  gotoLink(index: number) {
    this.router.navigate(['./' + this.tabs[index].link], {
      relativeTo: this.activatedRoute
    });
  }
}
