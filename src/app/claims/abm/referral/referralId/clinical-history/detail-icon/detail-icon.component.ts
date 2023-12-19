import {
  ChangeDetectionStrategy,
  Component,
  Input,
  OnInit,
  ViewEncapsulation
} from '@angular/core';

@Component({
  selector: 'healthe-detail-icon',
  templateUrl: './detail-icon.component.html',
  styleUrls: ['./detail-icon.component.scss'],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DetailIconComponent implements OnInit {
  @Input()
  selectionType;

  constructor() {}

  ngOnInit() {}
}
