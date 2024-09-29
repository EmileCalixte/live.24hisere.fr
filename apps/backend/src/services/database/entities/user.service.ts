import { Injectable } from "@nestjs/common";
import { eq } from "drizzle-orm";
import { user } from "drizzle/schema";
import { User } from "src/types/User";
import { EntityService } from "../entity.service";

@Injectable()
export class UserService extends EntityService {
    async getUsers(): Promise<User[]> {
        return await this.db.query.user.findMany();
    }

    async getUserById(userId: number): Promise<User | null> {
        const users = await this.db
            .select()
            .from(user)
            .where(eq(user.id, userId));

        return this.getUniqueResult(users);
    }

    async getUserByUsername(username: string): Promise<User | null> {
        const users = await this.db
            .select()
            .from(user)
            .where(eq(user.username, username));

        return this.getUniqueResult(users);
    }

    async createUser(userData: Omit<User, "id">): Promise<User> {
        await this.db.insert(user).values(userData);

        const newUser = await this.getUserByUsername(userData.username);

        if (!newUser) {
            throw new Error("Failed to insert a user in database");
        }

        return newUser;
    }

    async updateUser(
        userId: number,
        newUserData: Partial<Omit<User, "id">>,
    ): Promise<User> {
        const [resultSetHeader] = await this.db
            .update(user)
            .set(newUserData)
            .where(eq(user.id, userId));

        if (resultSetHeader.affectedRows === 0) {
            throw new Error(`User with ID ${userId} not found in database`);
        }

        const newUser = await this.getUserById(userId);

        if (!newUser) {
            throw new Error(
                `Failed to get updated user data from database (updated user ID: ${userId}`,
            );
        }

        return newUser;
    }
}
