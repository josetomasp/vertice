/**
 * @name ErrorMessage
 * @member {HTMLElement} for - Targeted element that has an error message. This is used for us to use scrollIntoView
 * @member {string} message - Human readable error message
 * An interface to pass around error messages with a reference to it's owner
 */

export interface ErrorMessage {
  for: HTMLElement;
  message: string;
  path: string;
}

export type FormValidationMemberLabel = string | number;
