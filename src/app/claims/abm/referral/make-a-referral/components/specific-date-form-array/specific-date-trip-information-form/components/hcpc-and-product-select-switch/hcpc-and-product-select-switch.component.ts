import {
  ChangeDetectionStrategy,
  Component,
  Input,
  OnChanges,
  OnDestroy,
  SimpleChanges,
  ViewEncapsulation
} from '@angular/core';
import { FormGroup } from '@angular/forms';
import { HealtheSelectOption } from '@shared';
import { ConfirmationModalService } from '@shared/components/confirmation-modal/confirmation-modal.service';
import { Observable, Subject } from 'rxjs';
import {
  distinctUntilChanged,
  filter,
  map,
  takeUntil,
  tap
} from 'rxjs/operators';
import {
  CustomerServiceGroupConfiguration,
  CustomerServiceGroupSubType
} from '../../../../../../store/models/make-a-referral.models';

@Component({
  selector: 'healthe-hcpc-and-product-select-switch',
  templateUrl: './hcpc-and-product-select-switch.component.html',
  styleUrls: ['./hcpc-and-product-select-switch.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None
})
export class HcpcAndProductSelectSwitchComponent
  implements OnChanges, OnDestroy {
  @Input()
  parentFormGroup: FormGroup;

  @Input()
  index: any;

  @Input()
  productOptions$: Observable<CustomerServiceGroupConfiguration[]>;

  @Input()
  currentStepIndex: number;

  draftProduct: CustomerServiceGroupSubType;

  categories$: Observable<HealtheSelectOption<CustomerServiceGroupSubType[]>[]>;
  products$: Observable<HealtheSelectOption<CustomerServiceGroupSubType>[]>;
  private unsubscribe$ = new Subject<never>();

  constructor(public confirmationModalService: ConfirmationModalService) {}

  get productSelectionMode() {
    return this.parentFormGroup.get('productSelectionMode');
  }

  get category() {
    return this.parentFormGroup.get('category');
  }

  get product() {
    return this.parentFormGroup.get('product');
  }

  get hcpc() {
    return this.parentFormGroup.get('hcpc');
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes) {
      if (
        changes['parentFormGroup'] &&
        changes['parentFormGroup'].firstChange
      ) {
        if (this.hcpc.value) {
          this.product.disable();
          this.category.disable();
        } else {
          this.hcpc.disable();
        }
        this.products$ = this.category.valueChanges.pipe(
          filter(() => this.category.status !== 'DISABLED'),
          distinctUntilChanged(
            (prodConfig1, prodConfig2) =>
              prodConfig1 &&
              prodConfig2 &&
              prodConfig1.value[0] &&
              prodConfig2.value[0] &&
              prodConfig1.value[0].customerTypeId ===
                prodConfig2.value[0].customerTypeId
          ),
          tap(() => {
            this.product.reset();
            if (this.draftProduct) {
              this.product.setValue(this.draftProduct);
              this.draftProduct = undefined;
            }
          }),
          map((prodConfig) =>
            prodConfig.value
              .filter((subType) => subType && subType.subTypeDescription !== '')
              .map((subType) => ({
                label: subType.subTypeDescription,
                value: subType
              }))
          )
        );
      }

      if (
        changes['productOptions$'] &&
        changes['productOptions$'].firstChange
      ) {
        this.categories$ = this.productOptions$.pipe(
          takeUntil(this.unsubscribe$),
          map((productConfigs) => {
            const categories = productConfigs.map((config) => ({
              label: config.groupName,
              value: config.subTypes
            }));
            return categories;
          }),
          tap((categories) => {
            if (!this.category.value && this.product.value) {
              this.repairCategory(this.product.value, categories);
            }
          })
        );
      }
    }
  }

  ngOnDestroy() {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }

  productSelectionModeChange($event: Event, selectedValue: string) {
    if (selectedValue !== this.productSelectionMode.value) {
      if (
        (this.productSelectionMode.value === 'category' &&
          this.category.dirty) ||
        (this.productSelectionMode.value === 'hcpc' && this.hcpc.dirty)
      ) {
        $event.preventDefault();
        this.confirmationModalService
          .displayModal({
            titleString: 'Are You Sure?',
            bodyHtml:
              'Switching modes will clear data for the fields on this row. Are you sure you want to proceed?',
            affirmString: 'YES',
            denyString: 'NO'
          })
          .afterClosed()
          .pipe(filter((confirm) => confirm))
          .subscribe(() => {
            this.switchSelectionMode();
          });
      } else {
        this.switchSelectionMode();
      }
    }
  }

  private switchSelectionMode() {
    if (this.productSelectionMode.value === 'category') {
      this.productSelectionMode.setValue('hcpc');
      this.product.disable();
      this.product.reset();
      this.category.disable();
      this.category.reset();
      this.hcpc.enable();
    } else {
      this.productSelectionMode.setValue('category');
      this.hcpc.disable();
      this.hcpc.reset();
      this.product.enable();
      this.category.enable();
    }
  }

  public categoryCompare(option, selection) {
    return (
      option &&
      selection &&
      option.value[0] &&
      selection.value[0] &&
      option.value[0].customerTypeId === selection.value[0].customerTypeId
    );
  }

  public productCompare(option, selection) {
    return (
      option &&
      selection &&
      option.customerTypeId === selection.customerTypeId &&
      option.customerSubTypeId === selection.customerSubTypeId
    );
  }

  repairCategory(
    product: CustomerServiceGroupSubType,
    categories: HealtheSelectOption<CustomerServiceGroupSubType[]>[]
  ) {
    if (product && product.customerTypeId) {
      this.draftProduct = product;
      const customerTypeId = product.customerTypeId;
      let chosenCategory: HealtheSelectOption<CustomerServiceGroupSubType[]>;
      chosenCategory = categories.find(
        (category) => category.value[0].customerTypeId === customerTypeId
      );
      if (chosenCategory) {
        /*
        Because the product dropdown needs the a category dropdown value,
        we need a timeout for the value change to respond to get the products
        from the category
        */

        setTimeout(() => {
          this.category.setValue(chosenCategory);
        }, 10);
      }
    }
  }
}
