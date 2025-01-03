/**
 * All custom errors should extend this one
 */
export abstract class CustomError extends Error {
  constructor(message?: string, options?: ErrorOptions) {
    super(message, options);
    this.name = this.constructor.name;
  }
}
