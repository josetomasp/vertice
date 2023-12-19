/**
 * Model to be used in the future if multiple call mediation is needed
 */
export interface SuccessfulBackendCall {
  verb: string;
  url: string;
  statusCode: number;
}

/**
 * Model used for holding all the information about a call to a foreign API which failed. This may be used when
 * aggregating data or most commonly for a single call which fails.
 * @see <a href="https://app.swaggerhub.com/domains/Healthesystems/Vertice-BFF-Common-Domain/1.0.0">Vertice-BFF-Common-Domain OAS</a>
 */
export interface FailedBackendCall {
  verb: string;
  url: string;
  statusCode: number;
  explanations: string[];
}

export interface VerticeMediatedResponse {
  successfulBackendCalls: SuccessfulBackendCall[] | null;
  failedBackendCalls: FailedBackendCall[] | null;
}
