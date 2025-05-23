import { Injectable } from "@nestjs/common";
import { eq } from "drizzle-orm";
import { AccessToken, User } from "@live24hisere/core/types";
import { TABLE_ACCESS_TOKEN } from "../../../../drizzle/schema";
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

  async getAccessTokenByStringToken(stringToken: string): Promise<AccessToken | null> {
    const accessTokens = await this.db
      .select()
      .from(TABLE_ACCESS_TOKEN)
      .where(eq(TABLE_ACCESS_TOKEN.token, stringToken));

    return this.getUniqueResult(accessTokens);
  }

  async createAccessTokenForUser(user: User): Promise<AccessToken> {
    const stringToken = this.randomService.getRandomString(32, HEXADECIMAL);

    await this.db.insert(TABLE_ACCESS_TOKEN).values({
      userId: user.id,
      token: stringToken,
      expirationDate: this.getTokenExpirationDateFromNow().toISOString(),
    });

    const newAccessToken = await this.getAccessTokenByStringToken(stringToken);

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
    const [resultSetHeader] = await this.db.delete(TABLE_ACCESS_TOKEN).where(eq(TABLE_ACCESS_TOKEN.token, token));

    return !!resultSetHeader.affectedRows;
  }

  /**
   * Deletes all access tokens of a user
   * @param user The user
   * @returns number of deleted access tokens
   */
  async deleteUserAccessTokens(user: User): Promise<number> {
    const [resultSetHeader] = await this.db.delete(TABLE_ACCESS_TOKEN).where(eq(TABLE_ACCESS_TOKEN.userId, user.id));

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
