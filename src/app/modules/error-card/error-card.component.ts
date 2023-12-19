import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  Input,
  OnInit
} from '@angular/core';
import { faExclamationTriangle } from '@fortawesome/pro-solid-svg-icons';

@Component({
  selector: 'healthe-error-card',
  templateUrl: './error-card.component.html',
  styleUrls: ['./error-card.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ErrorCardComponent implements OnInit {
  @Input()
  expanded: boolean;

  constructor(public elementRef: ElementRef) {}

  faExclamationTriangle = faExclamationTriangle;

  ngOnInit() {}
}
