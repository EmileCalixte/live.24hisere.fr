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
