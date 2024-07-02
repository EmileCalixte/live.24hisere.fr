import { type User } from "@prisma/client";

/**
 * Admin data about a user
 */
export type AdminUser = Omit<User, "passwordHash">;
