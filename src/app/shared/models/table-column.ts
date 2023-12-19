import {
  HealtheTableColumnCellType,
  HealtheTableColumnType
} from '@healthe/vertice-library';
import { Subject } from 'rxjs';
import { PbmGridInformationIconConfig } from '@modules/healthe-grid';

export interface HealtheTableColumnDef {
  classes?: Array<string>;
  headerClasses?: Array<string>;
  headerToolTip?: string;
  cellClasses?: Array<string>;
  dynamicCellClasses?: (value: any) => string[];
  styles?: Object;
  headerStyles?: Object;
  cellStyles?: Object;
  defaultColumn?: boolean;
  label: string;
  name: string;
  dataType?: HealtheTableColumnType;
  cellType?: HealtheTableColumnCellType;
  align?: 'left' | 'right' | 'before' | 'after' | 'center';
  comparator?: (a: any, b: any, ascending: boolean) => number;
  clickEvent?: Subject<any>;
  auxClickEvent?: Subject<any>;
  staticLabel?: string;
  linkCondition?: (rowData: any) => boolean;
  linkProp?: string;
  informationIcon?: (rowData: any) => PbmGridInformationIconConfig;
}
