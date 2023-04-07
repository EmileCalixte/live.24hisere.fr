import {Body, Controller, Post} from "@nestjs/common";
import {LoginDto} from "../dtos/login.dto";
import {AuthService} from "../services/auth.service";

interface LoginResponse {
    accessToken: string;
    expirationTime: string;
}

@Controller()
export class AuthController {
    constructor(
        private readonly authService: AuthService
    ) {}

    @Post("/auth/login")
    async login(@Body() loginDto: LoginDto): Promise<LoginResponse> {
        const accessToken = await this.authService.login(loginDto.username, loginDto.password);

        return {
            accessToken: accessToken.token,
            expirationTime: accessToken.expirationDate.toISOString(),
        };
    }
}
