export interface User {
    id: number;
    username: string;
    passwordHash: string;
}

/**
 * Admin data about a user
 */
export type AdminUser = Omit<User, "passwordHash">;
