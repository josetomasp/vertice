import { AllActivityData } from '@shared/models/claim-activity-data';
import { SharedClaimHistoryFilters } from '@shared/store/models/sharedClaimHistory.models';
import * as _ from 'lodash';

export function getAllSharedHistoryFilters(
  sharedHistoryItem: AllActivityData[]
): SharedClaimHistoryFilters {
  let filters: SharedClaimHistoryFilters = {} as SharedClaimHistoryFilters;

  filters.prescriberName = _.sortBy(
    _.union(
      _.clone(sharedHistoryItem).map(
        (histItem: AllActivityData) => histItem.prescriberName
      )
    )
  );

  filters.outcome = _.sortBy(
    _.union(
      _.clone(sharedHistoryItem).map(
        (histItem: AllActivityData) => histItem.outcome
      )
    )
  );

  filters.activityType = _.sortBy(
    _.union(
      _.clone(sharedHistoryItem).map((histItem: AllActivityData) => {
        return histItem.activityType;
      })
    )
  );

  filters.itemName = _.sortBy(
    _.union(
      _.clone(sharedHistoryItem).map(
        (histItem: AllActivityData) => histItem.itemName
      )
    )
  );

  return filters;
}
