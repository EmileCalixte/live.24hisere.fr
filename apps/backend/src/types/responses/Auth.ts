import { DateISOString } from "../Date";

export interface LoginResponse {
    accessToken: string;
    expirationTime: DateISOString;
}

export interface CurrentUserInfoResponse {
    user: {
        username: string;
    };
}
