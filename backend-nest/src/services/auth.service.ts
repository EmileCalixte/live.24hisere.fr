import {HttpException, HttpStatus, Injectable} from "@nestjs/common";
import {AccessToken} from "@prisma/client";
import {UserService} from "./database/entities/user.service";
import {AccessTokenService} from "./database/entities/accessToken.service";
import {PasswordService} from "./password.service";

const INVALID_CREDENTIALS_MESSAGE = "Invalid credentials";

@Injectable()
export class AuthService {
    constructor(
        private readonly accessTokenService: AccessTokenService,
        private readonly userService: UserService,
        private readonly passwordService: PasswordService,
    ) {}

    async login(username: string, password: string): Promise<AccessToken> {
        const user = await this.userService.getUser({username});

        if (!user) {
            throw new HttpException(INVALID_CREDENTIALS_MESSAGE, HttpStatus.FORBIDDEN);
        }

        const isPasswordVerified = await this.passwordService.verifyPassword(user.passwordHash, password);

        if (!isPasswordVerified) {
            throw new HttpException(INVALID_CREDENTIALS_MESSAGE, HttpStatus.FORBIDDEN);
        }

        return await this.accessTokenService.createAccessToken(user);
    }
}
