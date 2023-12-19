import { ComponentPortal, PortalInjector } from '@angular/cdk/portal';
import {
  AfterViewInit,
  Component,
  Injector,
  Input,
  OnInit
} from '@angular/core';
import { select, Store } from '@ngrx/store';
import { distinctUntilChanged, filter } from 'rxjs/operators';
import { LanguageSelectionComponent } from '../language/language-selection/language-selection.component';
import { LanguageWizardComponent } from '../language/language-wizard/language-wizard.component';
import { RootState } from '../../../../../store/models/root.models';
import { getSectionStatusByType } from '../../store/selectors/makeReferral.selectors';
import { TransportationSelectionComponent } from '../transportation/transportation-selection/transportation-selection.component';
import { TransportationWizardComponent } from '../transportation/transportation-wizard/transportation-wizard.component';
import { MatExpansionPanel } from '@angular/material/expansion';
import { WizardBaseDirective } from '../components/wizard-base.directive';
import { MAT_EXPANSION_PANEL_REF } from '../make-a-referral-shared';
import { DiagnosticsWizardComponent } from '../diagnostics/diagnostics-wizard/diagnostics-wizard.component';
import { DiagnosticsSelectionComponent } from '../diagnostics/diagnostics-selection/diagnostics-selection.component';
import { PhysicalMedicineSelectionComponent } from '../physical-medicine/physical-medicine-selection/physical-medicine-selection.component';
import { PhysicalMedicineWizardComponent } from '../physical-medicine/physical-medicine-wizard/physical-medicine-wizard.component';
import { FusionServiceName } from '../../store/models/fusion/fusion-make-a-referral.models';
import { HomeHealthSelectionComponent } from '../home-health/home-health-selection/home-health-selection.component';
import { HomeHealthWizardComponent } from '../home-health/home-health-wizard/home-health-wizard.component';
import { DmeWizardComponent } from '../dme/dme-wizard/dme-wizard.component';

@Component({
  selector: 'healthe-wizard-portal',
  templateUrl: './wizard-portal.component.html',
  styleUrls: ['./wizard-portal.component.scss']
})
export class WizardPortalComponent implements OnInit, AfterViewInit {
  @Input()
  referralType: string;
  @Input()
  serviceExpansionPanel: MatExpansionPanel;

  componentRegistry = {
    Transportation: {
      detailSelection: TransportationSelectionComponent,
      wizard: TransportationWizardComponent
    },
    [FusionServiceName.Language]: {
      detailSelection: LanguageSelectionComponent,
      wizard: LanguageWizardComponent
    },
    [FusionServiceName.Diagnostics]: {
      detailSelection: DiagnosticsSelectionComponent,
      wizard: DiagnosticsWizardComponent
    },
    [FusionServiceName.PhysicalMedicine]: {
      detailSelection: PhysicalMedicineSelectionComponent,
      wizard: PhysicalMedicineWizardComponent
    },
    [FusionServiceName.HomeHealth]: {
      detailSelection: HomeHealthSelectionComponent,
      wizard: HomeHealthWizardComponent
    },
    [FusionServiceName.DME]: {
      detailSelection: DmeWizardComponent,
      wizard: DmeWizardComponent
    }
  };
  wizardPortalComponent: ComponentPortal<WizardBaseDirective>;

  constructor(public store$: Store<RootState>, private injector: Injector) {}

  ngOnInit() {}

  loadComponent(type, status) {
    const component = this.componentRegistry[type][status];
    const injectorTokens = new WeakMap();
    injectorTokens.set(MAT_EXPANSION_PANEL_REF, this.serviceExpansionPanel);

    this.wizardPortalComponent = new ComponentPortal(
      component,
      null,
      new PortalInjector(this.injector, injectorTokens)
    );
  }

  ngAfterViewInit(): void {
    this.store$
      .pipe(
        select(getSectionStatusByType(this.referralType)),
        distinctUntilChanged(),
        filter((v) => !!v)
      )
      .subscribe((status) => {
        this.loadComponent(this.referralType, status);
      });
  }
}
