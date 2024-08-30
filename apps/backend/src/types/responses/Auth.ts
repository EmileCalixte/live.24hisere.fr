import { DateISOString } from "@live24hisere/types";

export interface LoginResponse {
    accessToken: string;
    expirationTime: DateISOString;
}

export interface CurrentUserInfoResponse {
    user: {
        username: string;
    };
}
