import {DateISOString} from "src/types/Date";

export interface LoginResponse {
    accessToken: string;
    expirationTime: DateISOString;
}

export interface CurrentUserInfoResponse {
    user: {
        username: string;
    };
}
