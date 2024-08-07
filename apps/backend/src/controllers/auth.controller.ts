import { Body, Controller, Get, HttpCode, Post, UseGuards } from "@nestjs/common";
import { type AuthData, LoggedInUser } from "../decorators/loggedInUser.decorator";
import { type LoginDto } from "../dtos/auth/login.dto";
import { AuthGuard } from "../guards/auth.guard";
import { type AuthService } from "../services/auth.service";
import { type AccessTokenService } from "../services/database/entities/accessToken.service";
import { type CurrentUserInfoResponse, type LoginResponse } from "../types/responses/Auth";

@Controller()
export class AuthController {
    constructor(
        private readonly accessTokenService: AccessTokenService,
        private readonly authService: AuthService,
    ) {}

    @Post("/auth/login")
    async login(@Body() loginDto: LoginDto): Promise<LoginResponse> {
        const accessToken = await this.authService.login(loginDto.username, loginDto.password);

        return {
            accessToken: accessToken.token,
            expirationTime: accessToken.expirationDate.toISOString(),
        };
    }

    @UseGuards(AuthGuard)
    @Post("/auth/logout")
    @HttpCode(204)
    async logout(@LoggedInUser() { accessToken }: AuthData): Promise<void> {
        await this.accessTokenService.deleteAccessToken({ token: accessToken });
    }

    @UseGuards(AuthGuard)
    @Get("/auth/current-user-info")
    async getCurrentUserInfo(@LoggedInUser() { user }: AuthData): Promise<CurrentUserInfoResponse> {
        return {
            user: {
                username: user.username,
            },
        };
    }
}
