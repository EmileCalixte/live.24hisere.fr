import { type DateISOString } from "./utils/dates";

export interface AccessToken {
  token: string;
  userId: number;
  expirationDate: DateISOString;
}
