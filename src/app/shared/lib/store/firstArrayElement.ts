import { map } from 'rxjs/operators';

export const firstArrayElement = () =>
  map((arr) => {
    if (Array.isArray(arr)) {
      return arr[0];
    } else {
      return arr;
    }
  });
