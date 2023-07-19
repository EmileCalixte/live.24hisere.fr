import { Controller, Get, UseGuards } from "@nestjs/common";
import { User } from "@prisma/client";
import { LoggedInUser } from "../../decorators/loggedInUser.decorator";
import { AuthGuard } from "../../guards/auth.guard";
import { UserService } from "../../services/database/entities/user.service";
import { type UsersResponse } from "../../types/responses/admin/Users";
import { excludeKeys } from "../../utils/misc.utils";

@Controller()
@UseGuards(AuthGuard)
export class UsersController {
    constructor(
        private readonly userService: UserService,
    ) {}

    @Get("/admin/users")
    async getUsers(@LoggedInUser() currentUser: User): Promise<UsersResponse> {
        const users = await this.userService.getUsers();

        return {
            users: users.map(user => ({
                ...excludeKeys(user, ["passwordHash"]),
                isCurrentUser: currentUser.id === user.id,
            })),
        };
    }
}
