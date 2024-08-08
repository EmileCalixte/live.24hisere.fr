import { ForbiddenException, Injectable, InternalServerErrorException, UnauthorizedException } from "@nestjs/common";
import { type AccessToken, type User } from "@prisma/client";
import { type UserService } from "./database/entities/user.service";
import { type AccessTokenService } from "./database/entities/accessToken.service";
import { type PasswordService } from "./password.service";

const INVALID_CREDENTIALS_MESSAGE = "Invalid credentials";
const INVALID_ACCESS_TOKEN_MESSAGE = "Access token is invalid";
const EXPIRED_ACCESS_TOKEN_MESSAGE = "Access token has expired";
const UNABLE_TO_AUTHENTICATE_MESSAGE = "Unable to authenticate";

@Injectable()
export class AuthService {
    constructor(
        private readonly accessTokenService: AccessTokenService,
        private readonly userService: UserService,
        private readonly passwordService: PasswordService,
    ) {}

    async login(username: string, password: string): Promise<AccessToken> {
        const user = await this.userService.getUser({ username });

        if (!user) {
            throw new ForbiddenException(INVALID_CREDENTIALS_MESSAGE);
        }

        const isPasswordVerified = await this.passwordService.verifyPassword(user.passwordHash, password);

        if (!isPasswordVerified) {
            throw new ForbiddenException(INVALID_CREDENTIALS_MESSAGE);
        }

        return await this.accessTokenService.createAccessToken(user);
    }

    async authenticateUser(token: string): Promise<User> {
        const accessToken = await this.accessTokenService.getAccessToken({ token });

        if (!accessToken) {
            throw new UnauthorizedException(INVALID_ACCESS_TOKEN_MESSAGE);
        }

        if (this.accessTokenService.isAccessTokenExpired(accessToken)) {
            throw new UnauthorizedException(EXPIRED_ACCESS_TOKEN_MESSAGE);
        }

        const user = await this.userService.getUser({
            id: accessToken.userId,
        });

        if (!user) {
            throw new InternalServerErrorException(UNABLE_TO_AUTHENTICATE_MESSAGE);
        }

        return user;
    }
}
