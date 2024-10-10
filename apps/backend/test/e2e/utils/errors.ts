interface ErrorJson {
    message: string;
    error: string;
    statusCode: number;
}

/**
 * Returns expected JSON for a 400 Bad Request error
 */
export function badRequestBody(message: string): ErrorJson {
    return getErrorObject(message, "Bad Request", 400);
}

/**
 * Returns expected JSON for a 401 Unauthorized error
 */
export function unauthorizedBody(message: string): ErrorJson {
    return getErrorObject(message, "Unauthorized", 401);
}

/**
 * Returns expected JSON for a 403 Forbidden error
 */
export function forbiddenBody(message: string): ErrorJson {
    return getErrorObject(message, "Forbidden", 403);
}

/**
 * Returns expected JSON for a 404 Not Found error
 */
export function notFoundBody(message: string): ErrorJson {
    return getErrorObject(message, "Not Found", 404);
}

function getErrorObject(
    message: string,
    error: string,
    statusCode: number,
): ErrorJson {
    return { message, error, statusCode };
}
