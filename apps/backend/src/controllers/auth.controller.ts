import {
    Body,
    Controller,
    Get,
    HttpCode,
    Post,
    UseGuards,
} from "@nestjs/common";
import {
    ApiResponse,
    GetCurrentUserInfoApiRequest,
    LoginApiRequest,
} from "@live24hisere/core/types";
import { AuthData, LoggedInUser } from "../decorators/loggedInUser.decorator";
import { LoginDto } from "../dtos/auth/login.dto";
import { AuthGuard } from "../guards/auth.guard";
import { AuthService } from "../services/auth.service";
import { AccessTokenService } from "../services/database/entities/accessToken.service";

@Controller()
export class AuthController {
    constructor(
        private readonly accessTokenService: AccessTokenService,
        private readonly authService: AuthService,
    ) {}

    @Post("/auth/login")
    async login(
        @Body() loginDto: LoginDto,
    ): Promise<ApiResponse<LoginApiRequest>> {
        const accessToken = await this.authService.login(
            loginDto.username,
            loginDto.password,
        );

        return {
            accessToken: accessToken.token,
            expirationTime: accessToken.expirationDate,
        };
    }

    @UseGuards(AuthGuard)
    @Post("/auth/logout")
    @HttpCode(204)
    async logout(@LoggedInUser() { accessToken }: AuthData): Promise<void> {
        await this.accessTokenService.deleteAccessTokenByStringToken(
            accessToken,
        );
    }

    @UseGuards(AuthGuard)
    @Get("/auth/current-user-info")
    async getCurrentUserInfo(
        @LoggedInUser() { user }: AuthData,
    ): Promise<ApiResponse<GetCurrentUserInfoApiRequest>> {
        return {
            user: {
                username: user.username,
            },
        };
    }
}
