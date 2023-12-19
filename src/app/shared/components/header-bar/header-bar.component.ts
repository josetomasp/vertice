import { Component, Input, OnInit } from '@angular/core';

export interface HeaderBarTitleLink {
  text?: string;
  link?: string | string[];
}

@Component({
  selector: 'healthe-header-bar',
  templateUrl: './header-bar.component.html',
  styleUrls: ['./header-bar.component.scss']
})
export class HeaderBarComponent implements OnInit {
  @Input()
  componentGroupName: string = 'banner';
  id = 'headerBar-claimDisplay';
  @Input() title: string;
  @Input() link: string[];
  @Input() gapSize: number = 10;

  constructor() {}

  ngOnInit() {}
}
