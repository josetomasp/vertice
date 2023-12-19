import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'healthe-search-results-count',
  templateUrl: './search-results-count.component.html',
  styleUrls: ['./search-results-count.component.scss']
})
export class SearchResultsCountComponent implements OnInit {
  @Input()
  resultsCount: number;

  @Input()
  resultsCountLimitErrorThreshold: number;

  @Input()
  searchIsRecordCountLimited: boolean;

  constructor() {}

  ngOnInit() {}
}
