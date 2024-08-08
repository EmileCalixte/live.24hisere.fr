import { Injectable } from "@nestjs/common";
import { AccessToken, Prisma, User } from "@prisma/client";
import { HEXADECIMAL, RandomService } from "../../random.service";
import { PrismaService } from "../prisma.service";

export const ACCESS_TOKEN_LIFETIME = 4 * 60 * 60 * 1000;

@Injectable()
export class AccessTokenService {
    constructor(
        private readonly prisma: PrismaService,
        private readonly randomService: RandomService,
    ) {}

    async getAccessToken(accessTokenWhereUniqueInput: Prisma.AccessTokenWhereUniqueInput): Promise<AccessToken | null> {
        return await this.prisma.accessToken.findUnique({
            where: accessTokenWhereUniqueInput,
        });
    }

    async createAccessToken(user: User): Promise<AccessToken> {
        return await this.prisma.accessToken.create({
            data: {
                userId: user.id,
                token: this.randomService.getRandomString(32, HEXADECIMAL),
                expirationDate: this.getTokenExpirationDateFromNow(),
            },
        });
    }

    async deleteAccessToken(where: Prisma.AccessTokenWhereUniqueInput): Promise<AccessToken> {
        return await this.prisma.accessToken.delete({ where });
    }

    async deleteAccessTokens(where: Prisma.AccessTokenWhereInput): Promise<number> {
        return (await this.prisma.accessToken.deleteMany({
            where,
        })).count;
    }

    isAccessTokenExpired(accessToken: AccessToken): boolean {
        const now = new Date();

        return now.getTime() > accessToken.expirationDate.getTime();
    }

    private getTokenExpirationDateFromNow(): Date {
        const now = new Date();

        return new Date(now.getTime() + ACCESS_TOKEN_LIFETIME);
    }
}
