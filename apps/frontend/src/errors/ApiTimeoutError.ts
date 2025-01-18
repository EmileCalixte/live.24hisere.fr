import { CustomError } from "./CustomError";

/**
 * An error thrown when an API request timed out
 */
export class ApiTimeoutError extends CustomError {}
