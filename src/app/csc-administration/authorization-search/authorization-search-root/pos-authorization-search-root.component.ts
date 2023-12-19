import { Component, OnInit } from '@angular/core';
import { PageTitleService } from '@shared/service/page-title.service';

@Component({
  selector: 'healthe-authorization-search-root',
  templateUrl: './pos-authorization-search-root.component.html',
  styleUrls: ['./pos-authorization-search-root.component.scss']
})
export class PosAuthorizationSearchRootComponent implements OnInit {
  constructor(private pageTitleService: PageTitleService) {
    this.pageTitleService.setTitle(
      'CSC Administration', // TODO: Why doesn't this CSC part appear anywhere?
      'POS Authorization Search'
    );
  }

  ngOnInit() {}
}
