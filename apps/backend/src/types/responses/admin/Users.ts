import { AdminUser } from "../../User";

export interface UsersResponse {
    users: Array<AdminUser & { isCurrentUser: boolean }>;
}
