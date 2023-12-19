import { Component, Input, OnInit } from '@angular/core';
import { faStar as solidStar } from '@fortawesome/pro-solid-svg-icons';
import { faStar as wireStar } from '@fortawesome/pro-regular-svg-icons';

interface Star {
  icon: any;
  color: string;
}

@Component({
  selector: 'healthe-stars',
  templateUrl: './stars.component.html',
  styleUrls: ['./stars.component.scss']
})
export class StarsComponent implements OnInit {
  @Input()
  starRating: number;

  starMap: Star[] = [];

  constructor() {}

  ngOnInit() {
    for (let i = 0; i < this.starRating; i++) {
      this.starMap.push({ icon: solidStar, color: 'gold' });
    }

    for (let i = 0; i < 5 - this.starRating; i++) {
      this.starMap.push({ icon: wireStar, color: 'gray' });
    }
  }
}
