import { CustomError } from "../CustomError";

/**
 * An error thrown when malformed or invalid data is encountered in a CSV file
 */
export class InvalidCsvDataError extends CustomError {}
