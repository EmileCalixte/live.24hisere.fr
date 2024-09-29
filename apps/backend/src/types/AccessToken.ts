import { DateISOString } from "./Date";

export interface AccessToken {
    token: string;
    userId: number;
    expirationDate: DateISOString;
}
