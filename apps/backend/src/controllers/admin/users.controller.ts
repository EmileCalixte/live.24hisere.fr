import {
    BadRequestException,
    Controller,
    Delete,
    Get,
    NotFoundException,
    Param,
    UseGuards,
} from "@nestjs/common";
import { ApiResponse, GetUsersAdminApiRequest } from "@live24hisere/core/types";
import { objectUtils } from "@live24hisere/utils";
import {
    AuthData,
    LoggedInUser,
} from "../../decorators/loggedInUser.decorator";
import { AuthGuard } from "../../guards/auth.guard";
import { AccessTokenService } from "../../services/database/entities/accessToken.service";
import { UserService } from "../../services/database/entities/user.service";

@Controller()
@UseGuards(AuthGuard)
export class UsersController {
    constructor(
        private readonly userService: UserService,
        private readonly accessTokenService: AccessTokenService,
    ) {}

    @Get("/admin/users")
    async getUsers(
        @LoggedInUser() { user: currentUser }: AuthData,
    ): Promise<ApiResponse<GetUsersAdminApiRequest>> {
        const users = await this.userService.getUsers();

        return {
            users: users.map((user) => ({
                ...objectUtils.excludeKeys(user, ["passwordHash"]),
                isCurrentUser: currentUser.id === user.id,
            })),
        };
    }

    @Delete("/admin/users/:userId/access-tokens")
    async deleteUserAccessTokens(
        @Param("userId") userId: string,
    ): Promise<void> {
        const id = Number(userId);

        if (isNaN(id)) {
            throw new BadRequestException("UserId must be a number");
        }

        const user = await this.userService.getUserById(id);

        if (!user) {
            throw new NotFoundException("Runner not found");
        }

        await this.accessTokenService.deleteUserAccessTokens(user);
    }
}
