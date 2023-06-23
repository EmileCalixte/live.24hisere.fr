import { Body, Controller, Get, Post, UseGuards } from "@nestjs/common";
import { User } from "@prisma/client";
import { LoggedInUser } from "../decorators/loggedInUser.decorator";
import { LoginDto } from "../dtos/login.dto";
import { AuthGuard } from "../guards/auth.guard";
import { AuthService } from "../services/auth.service";
import { type CurrentUserInfoResponse, type LoginResponse } from "../types/responses/Auth";

@Controller()
export class AuthController {
    constructor(
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
    @Get("/auth/current-user-info")
    async getCurrentUserInfo(@LoggedInUser() user: User): Promise<CurrentUserInfoResponse> {
        return {
            user: {
                username: user.username,
            },
        };
    }
}
