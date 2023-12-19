import * as _ from 'lodash';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { CardState, ReferralStage } from '../../store/models';

/**
 * Referral Activity :: Current Activity Filter
 * @description
 * Takes an array from combineLatest of the list of card states and serviceTypes.
 * Separates card data into the white listed stages and filterable
 * stages, then filters on the filterable cards.
 * @param {Observable<[CardState<any>[], string]>} observable
 */
export function referralActivityFilter(
  observable: Observable<[CardState<any>[], string]>
): Observable<CardState<any>[]> {
  return map(([cards, serviceType]: [CardState<any>[], string]) => {
    cards = _.clone(cards);
    const whiteListedStages = [
      ReferralStage.VENDOR_ASSIGNMENT,
      ReferralStage.SCHEDULE_SERVICE
    ];
    const whiteListedCards = _.remove(cards, (card) =>
      whiteListedStages.includes(card.stage)
    );
    if (serviceType) {
      cards = _.filter(cards, { serviceType });
    }
    return [...whiteListedCards, ...cards];
  })(observable);
}
