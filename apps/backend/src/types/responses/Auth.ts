import { DateISOString } from "@live24hisere/core/types";

export interface LoginResponse {
    accessToken: string;
    expirationTime: DateISOString;
}

export interface CurrentUserInfoResponse {
    user: {
        username: string;
    };
}
