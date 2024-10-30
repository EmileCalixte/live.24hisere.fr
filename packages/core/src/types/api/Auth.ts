import { type ApiRequest } from "./ApiRequest";

export interface GetCurrentUserInfoApiRequest extends ApiRequest {
    payload: never;

    response: {
        user: {
            username: string;
        };
    };
}

export interface LoginApiRequest extends ApiRequest {
    payload: {
        username: string;
        password: string;
    };

    response: {
        accessToken: string;
        expirationTime: string;
    };
}

export interface LogoutApiRequest extends ApiRequest {
    payload: never;

    response: never;
}
