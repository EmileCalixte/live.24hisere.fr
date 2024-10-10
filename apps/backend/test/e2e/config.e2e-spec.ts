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

    it("Test Disabled App", async () => {
        const disabledAppMessage = `Test disabled app message ${Date.now()}`;

        {
            const response = await request(app.getHttpServer())
                .get("/admin/disabled-app")
                .set("Authorization", ADMIN_USER_ACCESS_TOKEN)
                .expect(HttpStatus.OK);

            const json = JSON.parse(response.text);

            expect(json).toContainAllKeys([
                "isAppEnabled",
                "disabledAppMessage",
            ]);

            expect(json.isAppEnabled).toBeBoolean();
            expect(json.disabledAppMessage).toBeOneOf([
                expect.any(String),
                null,
            ]);
            expect(json.disabledAppMessage).not.toBe(disabledAppMessage);
        }

        {
            await request(app.getHttpServer())
                .patch("/admin/disabled-app")
                .set("Authorization", ADMIN_USER_ACCESS_TOKEN)
                .send({
                    isAppEnabled: true,
                    disabledAppMessage,
                })
                .expect(HttpStatus.OK);

            const response = await request(app.getHttpServer())
                .get("/admin/disabled-app")
                .set("Authorization", ADMIN_USER_ACCESS_TOKEN)
                .expect(HttpStatus.OK);

            const json = JSON.parse(response.text);

            expect(json.isAppEnabled).toBe(true);
            expect(json.disabledAppMessage).toBe(disabledAppMessage);
        }

        {
            const response = await request(app.getHttpServer())
                .get("/app-data")
                .expect(HttpStatus.OK);

            const json = JSON.parse(response.text);

            expect(json.isAppEnabled).toBe(true);
            expect(json.disabledAppMessage).toBe(null);
        }

        {
            await request(app.getHttpServer())
                .patch("/admin/disabled-app")
                .set("Authorization", ADMIN_USER_ACCESS_TOKEN)
                .send({
                    isAppEnabled: false,
                })
                .expect(HttpStatus.OK);

            const response = await request(app.getHttpServer())
                .get("/app-data")
                .expect(HttpStatus.OK);

            const json = JSON.parse(response.text);

            expect(json.isAppEnabled).toBe(false);
            expect(json.disabledAppMessage).toBe(disabledAppMessage);
        }
    });

    it("Test passage import settings", async () => {
        const dagFileUrl = `http://dag-file.test/${Date.now()}`;

        {
            const response = await request(app.getHttpServer())
                .get("/admin/passage-import")
                .set("Authorization", ADMIN_USER_ACCESS_TOKEN)
                .expect(HttpStatus.OK);

            const json = JSON.parse(response.text);

            expect(json).toContainAllKeys(["dagFileUrl"]);

            expect(json.dagFileUrl).toBeString();
            expect(json.dagFileUrl).not.toBe(dagFileUrl);
        }

        {
            await request(app.getHttpServer())
                .patch("/admin/passage-import")
                .set("Authorization", ADMIN_USER_ACCESS_TOKEN)
                .send({ dagFileUrl })
                .expect(HttpStatus.OK);

            const response = await request(app.getHttpServer())
                .get("/admin/passage-import")
                .set("Authorization", ADMIN_USER_ACCESS_TOKEN)
                .expect(HttpStatus.OK);

            const json = JSON.parse(response.text);

            expect(json.dagFileUrl).toBe(dagFileUrl);
        }
    });
});
