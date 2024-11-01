import { HttpStatus, INestApplication } from "@nestjs/common";
import request from "supertest";
import { afterEach, beforeEach, describe, expect, it } from "vitest";
import { urlUtils } from "@live24hisere/utils";
import { initApp } from "./_init";
import { ADMIN_USER_ACCESS_TOKEN, EXPIRED_ADMIN_USER_ACCESS_TOKEN } from "./constants/accessToken";
import { ISO8601_DATE_REGEX } from "./constants/dates";
import {
  ERROR_MESSAGE_ACCESS_TOKEN_EXPIRED,
  ERROR_MESSAGE_ACCESS_TOKEN_INVALID,
  ERROR_MESSAGE_ACCESS_TOKEN_NOT_PROVIDED,
  ERROR_MESSAGE_INVALID_CREDENTIALS,
} from "./constants/errors";
import { unauthorizedBody } from "./utils/errors";

describe("AuthController (e2e)", { concurrent: false }, () => {
  let app: INestApplication;

  beforeEach(async () => {
    app = await initApp();
  });

  afterEach(async () => {
    await app.close();
  });

  it("Get current user info (GET /auth/current-user-info)", async () => {
    const [response, noAccessTokenResponse, unknownTokenResponse, expiredTokenResponse] = await Promise.all([
      // Get current user info with valid access token
      request(app.getHttpServer())
        .get("/auth/current-user-info")
        .set("Authorization", ADMIN_USER_ACCESS_TOKEN)
        .expect(HttpStatus.OK),

      // Get current user info without access token
      request(app.getHttpServer()).get("/auth/current-user-info"),

      // Get current user info with unknown access token
      request(app.getHttpServer()).get("/auth/current-user-info").set("Authorization", "INVALID_TOKEN"),

      // Get current user info with unknown access token
      request(app.getHttpServer()).get("/auth/current-user-info").set("Authorization", EXPIRED_ADMIN_USER_ACCESS_TOKEN),
    ]);

    const json = JSON.parse(response.text);

    expect(json.user).toContainAllKeys(["username"]);

    expect(json.user.username).toBe("Admin");

    for (const response of [noAccessTokenResponse, unknownTokenResponse, expiredTokenResponse]) {
      expect(response.statusCode).toBe(HttpStatus.UNAUTHORIZED);
    }

    const noAccessTokenJson = JSON.parse(noAccessTokenResponse.text);

    expect(noAccessTokenJson).toEqual(unauthorizedBody(ERROR_MESSAGE_ACCESS_TOKEN_NOT_PROVIDED));

    const unknownTokenJson = JSON.parse(unknownTokenResponse.text);

    expect(unknownTokenJson).toEqual(unauthorizedBody(ERROR_MESSAGE_ACCESS_TOKEN_INVALID));

    const expiredTokenJson = JSON.parse(expiredTokenResponse.text);

    expect(expiredTokenJson).toEqual(unauthorizedBody(ERROR_MESSAGE_ACCESS_TOKEN_EXPIRED));
  });

  let accessToken1: string;
  let accessToken2: string;

  it("Login (POST /auth/login)", async () => {
    const validCredentials = {
      username: "Test",
      password: "test",
    };

    const invalidUsernameCredentials = {
      username: "UnknownUser",
      password: "any",
    };

    const invalidPasswordCredentials = {
      username: "Test",
      password: "invalid",
    };

    const [loginResponse1, loginResponse2, unknownUserResponse, invalidPasswordResponse] = await Promise.all([
      // Get an access token
      request(app.getHttpServer()).post("/auth/login").type("form").send(urlUtils.encode(validCredentials)),

      // Get another access token
      request(app.getHttpServer()).post("/auth/login").type("form").send(urlUtils.encode(validCredentials)),

      // Try to login with an unknown username
      request(app.getHttpServer()).post("/auth/login").type("form").send(urlUtils.encode(invalidUsernameCredentials)),

      // Try to login with a known username but invalid password
      request(app.getHttpServer()).post("/auth/login").type("form").send(urlUtils.encode(invalidPasswordCredentials)),
    ]);

    for (const response of [loginResponse1, loginResponse2]) {
      expect(response.statusCode).toBe(HttpStatus.CREATED);

      const json = JSON.parse(response.text);

      expect(json).toContainAllKeys(["accessToken", "expirationTime"]);
      expect(json.accessToken).toBeString();
      expect(json.accessToken).toMatch(/^[0-9a-fA-F]{32}$/);
      expect(json.expirationTime).toBeDateString();
      expect(json.expirationTime).toMatch(ISO8601_DATE_REGEX);
    }

    for (const response of [unknownUserResponse, invalidPasswordResponse]) {
      expect(response.statusCode).toBe(HttpStatus.UNAUTHORIZED);

      const json = JSON.parse(response.text);

      expect(json).toEqual(unauthorizedBody(ERROR_MESSAGE_INVALID_CREDENTIALS));
    }

    [accessToken1, accessToken2] = [loginResponse1, loginResponse2].map(
      (response) => JSON.parse(response.text).accessToken,
    );

    const userInfoResponses = await Promise.all([
      request(app.getHttpServer()).get("/auth/current-user-info").set("Authorization", accessToken1),
      request(app.getHttpServer()).get("/auth/current-user-info").set("Authorization", accessToken2),
    ]);

    for (const response of userInfoResponses) {
      expect(response.statusCode).toBe(HttpStatus.OK);
    }
  });

  it("Logout (POST /auth/logout)", async () => {
    // Send a logout request that deletes access token
    const logoutResponses = await Promise.all([
      request(app.getHttpServer()).post("/auth/logout").set("Authorization", accessToken1),
      request(app.getHttpServer()).post("/auth/logout").set("Authorization", accessToken2),
    ]);

    for (const response of logoutResponses) {
      expect(response.statusCode).toBe(HttpStatus.NO_CONTENT);
      expect(response.text).toBeEmpty();
    }

    const deletedTokenResponses = await Promise.all([
      // Try to logout again with same access tokens
      request(app.getHttpServer()).post("/auth/logout").set("Authorization", accessToken1),
      request(app.getHttpServer()).post("/auth/logout").set("Authorization", accessToken2),

      // Try to get current user info with the first deleted access token
      request(app.getHttpServer()).get("/auth/current-user-info").set("Authorization", accessToken1),

      // Try to get current user info with the other deleted access token
      request(app.getHttpServer()).get("/auth/current-user-info").set("Authorization", accessToken2),
    ]);

    for (const response of deletedTokenResponses) {
      expect(response.statusCode).toBe(HttpStatus.UNAUTHORIZED);

      const json = JSON.parse(response.text);

      expect(json).toEqual(unauthorizedBody(ERROR_MESSAGE_ACCESS_TOKEN_INVALID));
    }
  });
});
