export interface ApiRequest {
    payload: object | undefined;

    response: object | undefined;
}

export interface ApiRequestResult<T extends ApiRequest> {
    isOk: boolean;
    response: Response;
    json: T["response"] | undefined;
}

export interface ApiRequestResultOk<T extends ApiRequest> extends ApiRequestResult<T> {
    isOk: true;
    json: T["response"];
}
