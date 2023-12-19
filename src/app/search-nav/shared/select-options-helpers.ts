import { HealtheSelectOption, HealtheTableColumnDef } from '@shared';
import * as _ from 'lodash';
import { UserInfo } from '../../user/store/models/user.models';
import {
  ScreenSelectValueList,
  SelectValueList
} from '../store/models/search-options.model';

// Gets an array of label/value options from a customer specific list of SelectValueList
//  options (optionsByCustomer should only be an Object with one key for the CURRENT customer).
//  Also concatenates all available lists if the user is internal (optionsByCustomer should be an Object with one key for EVERY customer).
export function getSelectOptionsForCustomerSpecific(
  isInternal: boolean,
  optionsByCustomer,
  screenName?: string
): HealtheSelectOption<string>[] {
  if (isInternal) {
    return getInternalUserValuesForAllCustomers(optionsByCustomer);
  } else {
    return getSelectByScreenOptions(
      optionsByCustomer[Object.keys(optionsByCustomer)[0]],
      screenName
    );
  }
}
export function getSelectByScreenOptions(
  options,
  screenName?: string
): HealtheSelectOption<string>[] {
  let values: HealtheSelectOption<string>[] = [];
  if (options && options.valuesByScreen) {
    if (screenName) {
      values = getValueByScreenOrAllForSharedLists(
        options.valuesByScreen,
        screenName
      );
    } else {
      values = getValueByScreenOrAllForSharedLists(
        options.valuesByScreen,
        'ALL'
      );
    }
  }
  return values;
}

// Gets the customer specific default value string from a list of options by screenName
//  or a currently hard-coded 'All'
export function getDefaultValueByScreenOrAllForCustomerSpecific(
  user: UserInfo,
  selectValueConfigByCustomer,
  screenName: string
): string {
  if (user.internal) {
    return 'All';
  }
  return selectValueConfigByCustomer
    ? getDefaultValueByScreenOrAllForSharedLists(
        selectValueConfigByCustomer[user.customerID].valuesByScreen,
        screenName
      )
    : null;
}

// Gets the default value string from a list of options by screenName when it's not customer specific
export function getDefaultValueByScreenOrAllForSharedLists(
  selectValueConfig: { [screenName: string]: ScreenSelectValueList },
  screenName: string
): string {
  if (selectValueConfig) {
    if (selectValueConfig[screenName]) {
      return selectValueConfig[screenName].defaultValue;
    } else if (selectValueConfig['ALL']) {
      return selectValueConfig['ALL'].defaultValue;
    }

    return null;
  }
}

export function getValueByScreenOrAllForSharedLists(
  selectValueConfig: { [screenName: string]: ScreenSelectValueList },
  screenName: string
): HealtheSelectOption<string>[] {
  if (selectValueConfig) {
    if (selectValueConfig[screenName]) {
      return selectValueConfig[screenName].values;
    } else if (selectValueConfig['ALL']) {
      return selectValueConfig['ALL'].values;
    }

    return [];
  }
}

// Gets a concatenated list of options including all customers (for an internal user)
export function getInternalUserValuesForAllCustomers(optionsByCustomer: {
  [p: string]: SelectValueList;
}): HealtheSelectOption<string>[] {
  let allSelectOptions: HealtheSelectOption<string>[] = [];
  Object.keys(optionsByCustomer).forEach(
    (customerId) =>
      (allSelectOptions = allSelectOptions.concat(
        optionsByCustomer[customerId].valuesByScreen['ALL']
          ? optionsByCustomer[customerId].valuesByScreen['ALL'].values
          : []
      ))
  );

  // _.uniqWith(array, _.isEqual); removes duplicates
  return _.uniqWith(allSelectOptions, _.isEqual);
}

export function tableColumnDefToSelectOptions(
  cols: Partial<HealtheTableColumnDef>[]
): Array<HealtheSelectOption<string>> {
  return cols.map((col: HealtheTableColumnDef) => {
    return {
      label: col.label,
      value: col.name,
      isDisabled: false
    };
  });
}
