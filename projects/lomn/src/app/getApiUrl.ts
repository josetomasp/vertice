import { environment } from '../environments/environment';
import { apiUrls } from './apiUrls';

export function getApiUrl(endpoint: string, query?) {
  if (environment.remote) {
    return `${apiUrls[endpoint]}${query ? '?' + query : ''}`;
  } else {
    return `/api/${endpoint}`;
  }
}
