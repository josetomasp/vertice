import {
  Component,
  Input,
  OnChanges,
  OnInit,
  ViewEncapsulation
} from '@angular/core';
import { FeatureFlagService } from '../feature-flag.service';

@Component({
  selector: 'healthe-customer-configs-label',
  templateUrl: './customer-configs-label.component.html',
  styleUrls: ['./customer-configs-label.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class CustomerConfigsLabelComponent implements OnInit, OnChanges {
  @Input() defaultText: string;
  @Input() elementName: string;
  @Input() forcedCapitalization: boolean = true;

  public labelValue: string;

  constructor(private featureFlagService: FeatureFlagService) {}

  ngOnInit() {
    this.labelValue = this.featureFlagService.labelChange(
      this.defaultText,
      this.elementName
    );

    if (this.forcedCapitalization && this.labelValue) {
      this.labelValue = this.labelValue.toUpperCase();
    }
  }

  // ngOnChanges() added so that if we change input values for a template containing a
  //  healthe-customer-configs-label element then the output text is updated as well
  ngOnChanges() {
    this.ngOnInit();
  }
}
