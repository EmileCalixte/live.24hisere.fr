import { Injectable } from "@nestjs/common";
import { eq } from "drizzle-orm";
import { TABLE_USER } from "drizzle/schema";
import { User } from "src/types/User";
import { EntityService } from "../entity.service";

@Injectable()
export class UserService extends EntityService {
    async getUsers(): Promise<User[]> {
        return await this.db.query.TABLE_USER.findMany();
    }

    async getUserById(userId: number): Promise<User | null> {
        const users = await this.db
            .select()
            .from(TABLE_USER)
            .where(eq(TABLE_USER.id, userId));

        return this.getUniqueResult(users);
    }

    async getUserByUsername(username: string): Promise<User | null> {
        const users = await this.db
            .select()
            .from(TABLE_USER)
            .where(eq(TABLE_USER.username, username));

        return this.getUniqueResult(users);
    }

    async createUser(userData: Omit<User, "id">): Promise<User> {
        const result = await this.db
            .insert(TABLE_USER)
            .values(userData)
            .$returningId();

        const userId = this.getUniqueResult(result)?.id;

        if (userId === undefined) {
            throw new Error(
                "Failed to insert a runner in database (no ID returned)",
            );
        }

        const newUser = await this.getUserById(userId);

        if (!newUser) {
            throw new Error(
                `Failed to get created user data in database (created user ID: ${userId})`,
            );
        }

        return newUser;
    }

    async updateUser(
        userId: number,
        newUserData: Partial<Omit<User, "id">>,
    ): Promise<User> {
        const [resultSetHeader] = await this.db
            .update(TABLE_USER)
            .set(newUserData)
            .where(eq(TABLE_USER.id, userId));

        if (resultSetHeader.affectedRows === 0) {
            throw new Error(`User with ID ${userId} not found in database`);
        }

        const newUser = await this.getUserById(userId);

        if (!newUser) {
            throw new Error(
                `Failed to get updated user data from database (updated user ID: ${userId})`,
            );
        }

        return newUser;
    }
}
