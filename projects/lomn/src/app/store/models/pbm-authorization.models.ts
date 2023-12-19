import { AuthorizationInformationState } from './pbm-authorization-information.model';
import { LOMNWizardState } from './create-lomn.models';

export enum PbmAuthorizationServiceType {
  POS = 'pos',
  RTR = 'rtr',
  PAPER = 'paper'
}

export interface Authorization {
  authorizationType: string;
  authorizationId: string;
}

export interface PBMAuthorizationState {
  pbmAuthorizationInformationState: AuthorizationInformationState;
  pbmLOMNWizardState: LOMNWizardState;
  isLoading: boolean;
}

export interface AuthorizationQuery {
  authorizationId: string;
}
