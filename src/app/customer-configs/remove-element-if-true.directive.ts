import {
  Directive,
  Input,
  OnInit,
  TemplateRef,
  ViewContainerRef
} from '@angular/core';
import { FeatureFlagService } from './feature-flag.service';

@Directive({
  selector: '[healtheRemoveElementIfTrue]'
})
export class RemoveElementIfTrueDirective implements OnInit {
  private _componentGroupName: string;
  @Input('healtheRemoveElementIfTrue')
  set componentGroupName(componentGroupName: string) {
    this._componentGroupName = componentGroupName;
  }

  private _elementName: string;

  @Input('healtheRemoveElementIfTrueElementName')
  set healtheRemoveElementIfTrueElementName(elementName: string) {
    this._elementName = elementName;
  }

  constructor(
    private featureFlagService: FeatureFlagService,
    private templateRef: TemplateRef<any>,
    private viewContainerRef: ViewContainerRef
  ) {}

  ngOnInit() {
    if (
      !this.featureFlagService.shouldElementBeRemoved(
        this._componentGroupName,
        this._elementName
      )
    ) {
      this.viewContainerRef.createEmbeddedView(this.templateRef);
    }
  }
}
