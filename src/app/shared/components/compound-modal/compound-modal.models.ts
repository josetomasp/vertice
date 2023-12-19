import {
  PbmAuthorizationReason
} from '../../../claims/pbm/authorization/store/models/pbm-authorization-information/authorization-line-item.models';

export interface CompoundModalData {
  dispenseFees: number;
  ingredients: CompoundModalIngredient[];
}

export interface CompoundModalIngredient {
  drugName: string;
  ndc: string;
  quantity: number;
  createdDate: string;
  rejectReason: PbmAuthorizationReason;
  canItOpenLookupModal: boolean;
}
