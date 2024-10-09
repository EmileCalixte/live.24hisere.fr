import { HttpStatus, INestApplication } from "@nestjs/common";
import request from "supertest";
import { initApp } from "./_init";
import { notFoundBody } from "./utils/errors";

describe("AppDataController (e2e)", () => {
    let app: INestApplication;

    beforeEach(async () => {
        app = await initApp();
    });

    afterEach(async () => {
        await app.close();
    });

    it("Get unknown route (GET /this-route-doesnt-exist)", async () => {
        const response = await request(app.getHttpServer()).get(
            "/this-route-doesnt-exist",
        );

        expect(response.statusCode).toBe(HttpStatus.NOT_FOUND);

        const json = JSON.parse(response.text);

        expect(json).toContainAllEntries(
            Object.entries(notFoundBody("Cannot GET /this-route-doesnt-exist")),
        );
    });

    it("Get app data (GET /app-data)", async () => {
        const response = await request(app.getHttpServer()).get("/app-data");

        expect(response.statusCode).toBe(HttpStatus.OK);

        const json = JSON.parse(response.text);

        expect(json).toContainAllKeys([
            "currentTime",
            "isAppEnabled",
            "disabledAppMessage",
            "lastUpdateTime",
        ]);

        expect(json.currentTime).toBeDateString();
        expect(json.isAppEnabled).toBeBoolean();
        expect(json.disabledAppMessage).toBeOneOf([expect.any(String), null]);
        expect(json.lastUpdateTime).toBeDateString();
    });
});
