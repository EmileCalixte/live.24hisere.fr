export interface ApiRequest {
  /**
   * The data the client must send to the server in request body
   */
  payload: object | undefined;

  /**
   * The data returned by the server in response body
   */
  response: object | undefined;
}

export type ApiPayload<T extends ApiRequest> = T["payload"];
export type ApiResponse<T extends ApiRequest> = T["response"];

/**
 * @deprecated
 */
export interface ApiRequestResultLegacy<T extends ApiRequest> {
  /**
   * True if response is OK, false otherwise
   *
   * @see Response.ok
   */
  isOk: boolean;

  /**
   * The Response object
   */
  response: Response;

  /**
   * The data returned by the server in response body
   */
  json: T["response"] | undefined;
}

/**
 * @deprecated
 */
export interface ApiRequestResultOk<T extends ApiRequest> extends ApiRequestResultLegacy<T> {
  isOk: true;
  json: ApiResponse<T>;
}
