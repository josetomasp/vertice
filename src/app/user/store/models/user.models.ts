export interface UserState {
  info: UserInfo;
  errors: any[];
}

export interface UserInfo {
  username: string;
  email: string;
  customerID: string;
  firstName: string;
  lastName: string;
  internal: boolean;
  internalUserCustomer: string;
  oktaSettingsURL: string;
  jarvisLinkHidden: boolean;
  jarvisSSOLink?: string;
}
