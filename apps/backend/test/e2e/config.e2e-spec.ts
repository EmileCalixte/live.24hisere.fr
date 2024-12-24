import { HttpStatus, INestApplication } from "@nestjs/common";
import request from "supertest";
import { afterEach, beforeEach, describe, expect, it } from "vitest";
import { initApp } from "./_init";
import { ADMIN_USER_ACCESS_TOKEN } from "./constants/accessToken";

describe("Admin ConfigController (e2e)", () => {
  let app: INestApplication;

  beforeEach(async () => {
    app = await initApp();
  });

  afterEach(async () => {
    await app.close();
  });

  describe("Test Disabled App (GET-PATCH /admin/disabled-app)", () => {
    const disabledAppMessage = `Test disabled app message ${Date.now()}`;

    it("Get current disabled app settings", async () => {
      const response = await request(app.getHttpServer())
        .get("/admin/disabled-app")
        .set("Authorization", ADMIN_USER_ACCESS_TOKEN)
        .expect(HttpStatus.OK);

      const json = JSON.parse(response.text);

      expect(json).toContainAllKeys(["isAppEnabled", "disabledAppMessage"]);

      expect(json.isAppEnabled).toBeBoolean();
      expect(json.disabledAppMessage).toBeOneOf([expect.any(String), null]);
      expect(json.disabledAppMessage).not.toBe(disabledAppMessage);
    });

    it("Update disabled app message but app is enabled", async () => {
      const response = await request(app.getHttpServer())
        .patch("/admin/disabled-app")
        .set("Authorization", ADMIN_USER_ACCESS_TOKEN)
        .send({
          isAppEnabled: true,
          disabledAppMessage,
        })
        .expect(HttpStatus.OK);

      const json = JSON.parse(response.text);

      expect(json.isAppEnabled).toBe(true);
      expect(json.disabledAppMessage).toBe(disabledAppMessage);
    });

    it("Get disabled app settings after update", async () => {
      const response = await request(app.getHttpServer())
        .get("/admin/disabled-app")
        .set("Authorization", ADMIN_USER_ACCESS_TOKEN)
        .expect(HttpStatus.OK);

      const json = JSON.parse(response.text);

      expect(json.isAppEnabled).toBe(true);
      expect(json.disabledAppMessage).toBe(disabledAppMessage);
    });

    it("Check that disabled app message is not present in app data", async () => {
      const response = await request(app.getHttpServer()).get("/app-data").expect(HttpStatus.OK);

      const json = JSON.parse(response.text);

      expect(json.isAppEnabled).toBe(true);
      expect(json.disabledAppMessage).toBe(null);
    });

    it("Disable app", async () => {
      const response = await request(app.getHttpServer())
        .patch("/admin/disabled-app")
        .set("Authorization", ADMIN_USER_ACCESS_TOKEN)
        .send({
          isAppEnabled: false,
        })
        .expect(HttpStatus.OK);

      const json = JSON.parse(response.text);

      expect(json.isAppEnabled).toBe(false);
      expect(json.disabledAppMessage).toBe(disabledAppMessage);
    });

    it("Check that disabled app message is present in app data", async () => {
      const response = await request(app.getHttpServer()).get("/app-data").expect(HttpStatus.OK);

      const json = JSON.parse(response.text);

      expect(json.isAppEnabled).toBe(false);
      expect(json.disabledAppMessage).toBe(disabledAppMessage);
    });
  });

  describe("Test passage import settings (GET-PATCH /admin/passage-import)", () => {
    const dagFileUrl = `http://dag-file.test/${Date.now()}`;

    it("Get current passage import settings", async () => {
      const response = await request(app.getHttpServer())
        .get("/admin/passage-import")
        .set("Authorization", ADMIN_USER_ACCESS_TOKEN)
        .expect(HttpStatus.OK);

      const json = JSON.parse(response.text);

      expect(json).toContainAllKeys(["dagFileUrl"]);

      expect(json.dagFileUrl).toBeString();
      expect(json.dagFileUrl).not.toBe(dagFileUrl);
    });

    it("Update passage import URL", async () => {
      const response = await request(app.getHttpServer())
        .patch("/admin/passage-import")
        .set("Authorization", ADMIN_USER_ACCESS_TOKEN)
        .send({ dagFileUrl })
        .expect(HttpStatus.OK);

      const json = JSON.parse(response.text);

      expect(json.dagFileUrl).toBe(dagFileUrl);
    });

    it("Get passage import data after URL update", async () => {
      const response = await request(app.getHttpServer())
        .get("/admin/passage-import")
        .set("Authorization", ADMIN_USER_ACCESS_TOKEN)
        .expect(HttpStatus.OK);

      const json = JSON.parse(response.text);

      expect(json.dagFileUrl).toBe(dagFileUrl);
    });
  });
});
