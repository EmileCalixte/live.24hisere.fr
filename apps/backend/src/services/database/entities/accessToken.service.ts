import { Injectable } from "@nestjs/common";
import { User } from "@prisma/client";
import { eq } from "drizzle-orm";
import { accessToken } from "drizzle/schema";
import { AccessToken } from "src/types/AccessToken";
import { fixDrizzleDates } from "src/utils/drizzle.utils";
import { HEXADECIMAL, RandomService } from "../../random.service";
import { DrizzleService } from "../drizzle.service";
import { EntityService } from "../entity.service";

export const ACCESS_TOKEN_LIFETIME = 4 * 60 * 60 * 1000;

@Injectable()
export class AccessTokenService extends EntityService {
    constructor(
        drizzleService: DrizzleService,
        private readonly randomService: RandomService,
    ) {
        super(drizzleService);
    }

    async getAccessTokenByStringToken(
        stringToken: string,
    ): Promise<AccessToken | null> {
        const accessTokens = await this.db
            .select()
            .from(accessToken)
            .where(eq(accessToken.token, stringToken));

        const token = this.getUniqueResult(accessTokens);

        return token ? fixDrizzleDates(token) : null;
    }

    async createAccessTokenForUser(user: User): Promise<AccessToken> {
        const stringToken = this.randomService.getRandomString(32, HEXADECIMAL);

        await this.db.insert(accessToken).values({
            userId: user.id,
            token: stringToken,
            expirationDate: this.getTokenExpirationDateFromNow(),
        });

        const newAccessToken =
            await this.getAccessTokenByStringToken(stringToken);

        if (!newAccessToken) {
            throw new Error("Failed to insert an access token in database");
        }

        return newAccessToken;
    }

    /**
     * Deletes an access token
     * @param token The token to delete
     * @returns true if the token was found and deleted, false otherwise
     */
    async deleteAccessTokenByStringToken(token: string): Promise<boolean> {
        const [resultSetHeader] = await this.db
            .delete(accessToken)
            .where(eq(accessToken.token, token));

        return !!resultSetHeader.affectedRows;
    }

    /**
     * Deletes all access tokens of a user
     * @param user The user
     * @returns number of deleted access tokens
     */
    async deleteUserAccessTokens(user: User): Promise<number> {
        const [resultSetHeader] = await this.db
            .delete(accessToken)
            .where(eq(accessToken.userId, user.id));

        return resultSetHeader.affectedRows;
    }

    isAccessTokenExpired(accessToken: AccessToken): boolean {
        const now = new Date();

        return now.getTime() > new Date(accessToken.expirationDate).getTime();
    }

    private getTokenExpirationDateFromNow(): Date {
        const now = new Date();

        return new Date(now.getTime() + ACCESS_TOKEN_LIFETIME);
    }
}
