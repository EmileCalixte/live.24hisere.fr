import { HttpStatus, INestApplication } from "@nestjs/common";
import request from "supertest";
import { afterEach, beforeEach, describe, expect, it } from "vitest";
import { initApp } from "./_init";
import { BIRTH_YEAR_REGEX } from "./constants/birthYear";
import { ISO8601_DATE_REGEX } from "./constants/dates";
import { ERROR_MESSAGE_RACE_NOT_FOUND } from "./constants/errors";
import { notFoundBody } from "./utils/errors";

describe("RunnersController (e2e)", () => {
    let app: INestApplication;

    beforeEach(async () => {
        app = await initApp();
    });

    afterEach(async () => {
        await app.close();
    });

    it("Get runner list (GET /runners)", async () => {
        const response = await request(app.getHttpServer())
            .get("/runners")
            .expect(HttpStatus.OK);

        const json = JSON.parse(response.text);

        expect(json.runners).toBeArray();

        for (const runner of json.runners) {
            expect(runner).toContainAllKeys([
                "id",
                "firstname",
                "lastname",
                "gender",
                "birthYear",
                "stopped",
                "raceId",
            ]);

            expect(runner.id).toBeNumber();
            expect(runner.firstname).toBeString();
            expect(runner.lastname).toBeString();
            expect(runner.gender).toBeOneOf(["M", "F"]);
            expect(runner.birthYear).toBeString();
            expect(runner.birthYear.length).toBe(4);
            expect(runner.birthYear).toMatch(BIRTH_YEAR_REGEX);
            expect(runner.stopped).toBeBoolean();
            expect(runner.raceId).toBeNumber();
        }
    });

    it("Get race runners (GET /races/{id}/runners)", async () => {
        const [response, nonPublicResponse, notFoundResponse] =
            await Promise.all([
                // Get runners of an existing public race
                request(app.getHttpServer())
                    .get("/races/1/runners")
                    .expect(HttpStatus.OK),

                // Get runners of a non-public race
                request(app.getHttpServer())
                    .get("/races/5/runners")
                    .expect(HttpStatus.NOT_FOUND),

                // Get runners of a non-existing race
                request(app.getHttpServer())
                    .get("/races/10/runners")
                    .expect(HttpStatus.NOT_FOUND),
            ]);

        const json = JSON.parse(response.text);

        expect(json.runners).toBeArray();

        for (const runner of json.runners) {
            expect(runner).toContainAllKeys([
                "id",
                "firstname",
                "lastname",
                "gender",
                "birthYear",
                "stopped",
                "raceId",
                "passages",
            ]);

            expect(runner.id).toBeNumber();
            expect(runner.firstname).toBeString();
            expect(runner.lastname).toBeString();
            expect(runner.gender).toBeOneOf(["M", "F"]);
            expect(runner.birthYear).toBeString();
            expect(runner.birthYear.length).toBe(4);
            expect(runner.birthYear).toMatch(BIRTH_YEAR_REGEX);
            expect(runner.stopped).toBeBoolean();
            expect(runner.raceId).toBeNumber();
            expect(runner.passages).toBeArray();

            let previousPassageTime: Date | null = null;

            for (const passage of runner.passages) {
                expect(passage).toContainAllKeys(["id", "time"]);

                expect(passage.id).toBeNumber();
                expect(passage.time).toBeDateString();
                expect(passage.time).toMatch(ISO8601_DATE_REGEX);

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

        for (const response of [nonPublicResponse, notFoundResponse]) {
            const json = JSON.parse(response.text);

            expect(json).toEqual(notFoundBody(ERROR_MESSAGE_RACE_NOT_FOUND));
        }
    });
});
