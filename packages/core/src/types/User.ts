export interface User {
  id: number;
  username: string;
  passwordHash: string;
}

/**
 * Public data about a user
 */
export type PublicUser = Pick<User, "username">;

/**
 * Admin data about a user
 */
export type AdminUser = Omit<User, "passwordHash">;
