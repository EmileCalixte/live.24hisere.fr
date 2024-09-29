import {
    ForbiddenException,
    Injectable,
    InternalServerErrorException,
    UnauthorizedException,
} from "@nestjs/common";
import { User } from "@prisma/client";
import { AccessToken } from "src/types/AccessToken";
import { AccessTokenService } from "./database/entities/accessToken.service";
import { UserService } from "./database/entities/user.service";
import { PasswordService } from "./password.service";

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
        const user = await this.userService.getUserByUsername(username);

        if (!user) {
            throw new ForbiddenException(INVALID_CREDENTIALS_MESSAGE);
        }

        const isPasswordVerified = await this.passwordService.verifyPassword(
            user.passwordHash,
            password,
        );

        if (!isPasswordVerified) {
            throw new ForbiddenException(INVALID_CREDENTIALS_MESSAGE);
        }

        return await this.accessTokenService.createAccessTokenForUser(user);
    }

    async authenticateUser(token: string): Promise<User> {
        const accessToken =
            await this.accessTokenService.getAccessTokenByStringToken(token);

        if (!accessToken) {
            throw new UnauthorizedException(INVALID_ACCESS_TOKEN_MESSAGE);
        }

        if (this.accessTokenService.isAccessTokenExpired(accessToken)) {
            throw new UnauthorizedException(EXPIRED_ACCESS_TOKEN_MESSAGE);
        }

        const user = await this.userService.getUserById(accessToken.userId);

        if (!user) {
            throw new InternalServerErrorException(
                UNABLE_TO_AUTHENTICATE_MESSAGE,
            );
        }

        return user;
    }
}
