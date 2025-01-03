import { CustomError } from "./CustomError";

/**
 * An error thrown when an API request has resulted in an HTTP error status
 */
export class ApiError extends CustomError {
  /**
   * The status code of the request which caused this error
   */
  public readonly statusCode: number;

  /**
   * The data returned in response body
   */
  public readonly data: object | undefined;

  constructor(statusCode: number, data: object | undefined, message?: string, options?: ErrorOptions) {
    super(message, options);
    this.statusCode = statusCode;
    this.data = data;
  }
}
