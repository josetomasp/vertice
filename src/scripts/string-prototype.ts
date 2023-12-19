import { equalsIgnoreCase } from '@shared/lib/strings/equalsIgnoreCase';

declare global {
  interface String {
    /**
     * Adds a Java-esque equality check that casts to string and calls toLowerCase()
     * @param match
     */
    equalsIgnoreCase(match: string): boolean;
  }
}
String.prototype.equalsIgnoreCase = function(match: any) {
  return equalsIgnoreCase(this, match + '');
};
export {};
