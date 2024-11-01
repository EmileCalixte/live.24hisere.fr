import { type AdminUser } from "../User";
import { type ApiRequest } from "./ApiRequest";

export interface GetUsersAdminApiRequest extends ApiRequest {
  payload: never;

  response: {
    users: Array<AdminUser & { isCurrentUser: boolean }>;
  };
}
