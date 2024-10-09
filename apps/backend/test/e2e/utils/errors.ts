interface ErrorJson {
    message: string;
    error: string;
    statusCode: number;
}

/**
 * Returns expected JSON for a 401 Unauthorized error
 */
export function unauthorizedBody(message: string): ErrorJson {
    return {
        message,
        error: "Unauthorized",
        statusCode: 401,
    };
}

/**
 * Returns expected JSON for a 403 Forbidden error
 */
export function forbiddenBody(message: string): ErrorJson {
    return {
        message,
        error: "Forbidden",
        statusCode: 403,
    };
}

/**
 * Returns expected JSON for a 404 Not Found error
 */
export function notFoundBody(message: string): ErrorJson {
    return {
        message,
        error: "Not Found",
        statusCode: 404,
    };
}
