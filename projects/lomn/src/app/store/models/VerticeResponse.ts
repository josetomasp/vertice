export interface VerticeResponse<T> {
  responseBody: T;
  errors: string[];
  httpStatusCode: number;
}
