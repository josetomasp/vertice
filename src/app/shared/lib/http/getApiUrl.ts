import { apiUrls } from '../../../apiUrls';
import {environment} from '../../../../environments/environment';
export function getApiUrl(endpoint: string, query?) {
  if (environment.remote) {
    return `${apiUrls[endpoint]}${query ? '?' + query : ''}`;
  } else {
    return `/api/${endpoint}`;
  }
}

export function getApiUrlWithPathSegment(endpoint: string, pathSegment: string, query?) {
  if (environment.remote) {
    return `${apiUrls[endpoint] + pathSegment}${query ? '?' + query : ''}`;
  } else {
    return `/api/${endpoint}`;
  }
}
