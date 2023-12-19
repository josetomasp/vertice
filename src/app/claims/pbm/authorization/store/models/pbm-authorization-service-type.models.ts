export enum PbmAuthorizationServiceType {
  POS = 'pos',
  RTR = 'rtr',
  PAPER = 'paper'
}

export const PBM_SERVICE_TYPE_DISPLAY_MAP = {
  [PbmAuthorizationServiceType.POS]: 'POS',
  [PbmAuthorizationServiceType.RTR]: 'RTR'
};
