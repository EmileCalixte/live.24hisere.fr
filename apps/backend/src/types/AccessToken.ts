import { DateISOString } from "@live24hisere/types";

export interface AccessToken {
    token: string;
    userId: number;
    expirationDate: DateISOString;
}
