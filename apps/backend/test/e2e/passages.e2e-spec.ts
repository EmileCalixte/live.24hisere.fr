import { HttpStatus, INestApplication } from "@nestjs/common";
import request from "supertest";
import { afterEach, beforeEach, describe, expect, it } from "vitest";
import { AdminPassageWithRunnerId } from "@live24hisere/types";
import { initApp } from "./_init";
import { ADMIN_USER_ACCESS_TOKEN } from "./constants/accessToken";
import { ISO8601_DATE_REGEX } from "./constants/dates";

describe("Admin PassagesController (e2e)", () => {
    let app: INestApplication;

    beforeEach(async () => {
        app = await initApp();
    });

    afterEach(async () => {
        await app.close();
    });

    it("Get all passage list (GET /admin/passages)", async () => {
        const [withHiddenPassagesResponse, withoutHiddenPassagesResponse] =
            await Promise.all([
                request(app.getHttpServer())
                    .get("/admin/passages")
                    .set("Authorization", ADMIN_USER_ACCESS_TOKEN),
                request(app.getHttpServer())
                    .get("/admin/passages?excludeHidden")
                    .set("Authorization", ADMIN_USER_ACCESS_TOKEN),
            ]);

        for (const response of [
            withHiddenPassagesResponse,
            withoutHiddenPassagesResponse,
        ]) {
            expect(response.statusCode).toBe(HttpStatus.OK);

            const json = JSON.parse(response.text);

            expect(json.passages).toBeArray();

            let previousPassageTime: Date | null = null;

            for (const passage of json.passages) {
                expect(passage).toContainAllKeys([
                    "id",
                    "detectionId",
                    "importTime",
                    "runnerId",
                    "time",
                    "isHidden",
                ]);

                expect(passage.id).toBeNumber();
                expect(passage.detectionId).toBeOneOf([
                    expect.any(Number),
                    null,
                ]);

                if (passage.detectionId !== null) {
                    expect(passage.importTime).toBeDateString();
                    expect(passage.importTime).toMatch(ISO8601_DATE_REGEX);
                } else {
                    expect(passage.importTime).toBeNull();
                }

                expect(passage.runnerId).toBeNumber();
                expect(passage.time).toBeDateString();
                expect(passage.time).toMatch(ISO8601_DATE_REGEX);
                expect(passage.isHidden).toBeBoolean();

                const passageTime = new Date(passage.time);

                if (
                    previousPassageTime !== null &&
                    previousPassageTime.getTime() > passageTime.getTime()
                ) {
                    throw new Error(
                        `Passages are not ordered by time (passage time: ${passageTime.toISOString()}, previous passage time: ${previousPassageTime.toISOString()}`,
                    );
                }

                previousPassageTime = passageTime;
            }
        }

        const allPublicPassages: AdminPassageWithRunnerId[] = JSON.parse(
            withoutHiddenPassagesResponse.text,
        ).passages;
        const allPassages: AdminPassageWithRunnerId[] = JSON.parse(
            withHiddenPassagesResponse.text,
        ).passages;

        expect(
            allPublicPassages.filter((passage) => passage.isHidden),
        ).toBeEmpty();
        expect(
            allPassages.filter((passage) => passage.isHidden),
        ).not.toBeEmpty();
    });
});
