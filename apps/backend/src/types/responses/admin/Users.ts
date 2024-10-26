import { AdminUser } from "@live24hisere/core/types";

export interface UsersResponse {
    users: Array<AdminUser & { isCurrentUser: boolean }>;
}
