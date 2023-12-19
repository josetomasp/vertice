import {
  preferencePathIDMatcher,
  PreferenceQuery
} from '../store/models/preferences.models';

export function parsePrefPath(path: string): PreferenceQuery {
  if (preferencePathIDMatcher.test(path)) {
    const prefPathSegments = preferencePathIDMatcher.exec(path);
    const screenName = prefPathSegments[1];
    const componentGroupName = prefPathSegments[2];
    const componentName = prefPathSegments[3];
    const preferenceTypeName = prefPathSegments[4];
    const componentTypeName = prefPathSegments[5];
    return {
      screenName,
      componentGroupName,
      componentName,
      preferenceTypeName,
      componentTypeName
    };
  } else {
    console.warn('The pref path "' + path + '" didnt match');
    return undefined;
  }
}
