import { Component } from "@angular/core";
import { DestroyableComponent } from "@shared/components/destroyable/destroyable.component";
import { PageTitleService } from "@shared/service/page-title.service";


@Component({
  selector: 'healthe-pharmacy-search-container',
  templateUrl: 'pharmacy-search-container.component.html',
  styleUrls: ['pharmacy-search-container.component.scss']
})
export class PharmacySearchContainerComponent extends DestroyableComponent {

  constructor( private pageTitleService: PageTitleService,) {
    super();
    this.pageTitleService.setTitle('Pharmacy Search');
  }
}
