import { type User } from "@prisma/client";

export type AdminUser = Omit<User, "passwordHash">;
