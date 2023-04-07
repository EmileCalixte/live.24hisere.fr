import {Injectable} from "@nestjs/common";
import {AccessToken, User} from "@prisma/client";
import {HEXADECIMAL, RandomService} from "../../random.service";
import {PrismaService} from "../prisma.service";

export const ACCESS_TOKEN_LIFETIME = 4 * 60 * 60 * 1000;

@Injectable()
export class AccessTokenService {
    constructor(
        private readonly prisma: PrismaService,
        private readonly randomService: RandomService,
    ) {}

    async createAccessToken(user: User): Promise<AccessToken> {
        return this.prisma.accessToken.create({
            data: {
                userId: user.id,
                token: this.randomService.getRandomString(32, HEXADECIMAL),
                expirationDate: this.getTokenExpirationDateFromNow(),
            },
        });
    }

    private getTokenExpirationDateFromNow(): Date {
        const now = new Date();

        return new Date(now.getTime() + ACCESS_TOKEN_LIFETIME);
    }
}
