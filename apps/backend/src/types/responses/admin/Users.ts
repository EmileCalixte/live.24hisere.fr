import { AdminUser } from "@live24hisere/types";

export interface UsersResponse {
    users: Array<AdminUser & { isCurrentUser: boolean }>;
}
