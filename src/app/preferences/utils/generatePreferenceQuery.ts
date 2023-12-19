import { PreferenceQuery } from '../store/models/preferences.models';
import { curry } from 'lodash';

function generatePreferenceQuery(
  screenName: string,
  componentGroupName: string,
  componentName: string,
  preferenceTypeName: string,
  componentTypeName: string
): PreferenceQuery {
  return {
    screenName,
    componentGroupName,
    componentName,
    preferenceTypeName,
    componentTypeName
  };
}

export const curryPrefQuery = curry(generatePreferenceQuery);
