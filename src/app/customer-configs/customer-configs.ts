export interface CustomerConfigs {
  // Customer Configs are set up so that all elements are enabled and showing by
  //    default.  We are using a 'value' to make identifying elements easier but
  //    only setting the value to 'true' will disable/remove an element in the
  //    various sections.  In this setup, we can remove elements completely from
  //    the list and still have them show up on the screen, this should limit
  //    this list from expanding too large.
  elementsToRemove: CustomerConfigGroupNameAndElements[];
  elementsToDisable: CustomerConfigGroupNameAndElements[];
  labelChanges: CustomerConfigNameValuePair[];
  routesToDisable: CustomerConfigNameValuePair[];
  services: string[];
}

export interface CustomerConfigGroupNameAndElements {
  componentGroupName: string;
  elements: CustomerConfigNameValuePair[];
}

export interface CustomerConfigNameValuePair {
  name: string;
  value: any;
}
