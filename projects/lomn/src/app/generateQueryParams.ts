export function generateQueryParams(params: { [key: string]: any }) {
  const query = new URLSearchParams();
  if (params) {
    Object.keys(params).forEach((key) => {
      if (typeof params[key] !== 'undefined' && params[key] !== null) {
        query.append(key, params[key]);
      }
    });
  }

  return query;
}
