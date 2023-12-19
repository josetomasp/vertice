import {
  ChangeDetectionStrategy,
  Component,
  Input,
  OnChanges,
  SimpleChanges
} from '@angular/core';
import {
  DEFAULT_GRID_COMPONENT_CONTAINER_CONFIG,
  HealtheComponentConfig,
  HealtheGridButtonType,
  HealtheGridComponentType
} from '../healthe-grid-config.service';
import { faExclamationCircle } from '@fortawesome/pro-light-svg-icons';
import { MatDialog } from '@angular/material/dialog';
import { PayeeInfoModalComponent } from 'src/app/claims/pbm/authorization/authorization-information/payee-info-modal/payee-info-modal.component';
import { CompoundModalComponent } from '../../../shared/components/compound-modal/compound-modal.component';
import { PayeeInfoData } from '../../../claims/pbm/authorization/store/models/payee-info.data';
import { CompoundModalData } from '@shared';

/**
 * @name HealtheGridComponent
 * @description The main component that consumes the HealtheGridConfig from the
 * HealtheGridConfigService
 * @see HealtheGridConfig
 * @see HealtheGridConfigService
 */
@Component({
  selector: 'healthe-component-grid',
  templateUrl: './healthe-grid.component.html',
  styleUrls: ['./healthe-grid.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class HealtheGridComponent implements OnChanges {
  faExclamationCircle = faExclamationCircle;
  componentType = HealtheGridComponentType;
  buttonType = HealtheGridButtonType;
  @Input()
  componentConfig: HealtheComponentConfig;
  @Input()
  index: number;

  grid: any[] = [];
  container: any = {};

  // public get grid() {
  //   return this.componentConfig!.grid || [];
  // }

  // public get container() {
  //   return (
  //     this.componentConfig!.container ||
  //     Object.assign({}, DEFAULT_GRID_COMPONENT_CONTAINER_CONFIG)
  //   );
  // }

  constructor(public dialog: MatDialog) {}

  ngOnChanges(changes: SimpleChanges) {
    if (changes['componentConfig']) {
      this.grid = this.componentConfig.grid || [];
      this.container = this.componentConfig.container || {
        ...DEFAULT_GRID_COMPONENT_CONTAINER_CONFIG
      };
    }
  }

  openCompoundModal(compoundModalData: CompoundModalData) {
    this.dialog.open(CompoundModalComponent, {
      autoFocus: false,
      width: '700px',
      data: compoundModalData
    });
  }

  openPayeeModal(payeeData: PayeeInfoData) {
    this.dialog.open(PayeeInfoModalComponent, {
      autoFocus: false,
      width: '700px',
      data: payeeData
    });
  }
}
