/**
 * Healthesystems model used for conveying API errors. As of today, ngVertice-service is set up to
 * return this with a null errors String array and in the case of 500s only. There are currently no
 * plans to read from this object.
 * @see <a href="https://app.swaggerhub.com/domains/Healthesystems/Common-Domain/2.0.3#/components/responses/500">Healthesystems Common-Domain OAS</a>
 * @see <a href="https://confluence.healthesystems.com/pages/viewpage.action?spaceKey=EA&title=API+Style+Guide">Healthesystems API Style Guide</a>
 * @see <a href="https://tools.ietf.org/html/rfc7807">Problem Details RFC 7807</a>
 */
export interface ProblemDetails {
  type: string;
  title: string;
  status: number;
  detail: string;
  errors?: string[];
}
