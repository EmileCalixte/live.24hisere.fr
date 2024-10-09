import { HttpStatus, INestApplication } from "@nestjs/common";
import request from "supertest";
import { initApp } from "./_init";
import { BIRTH_YEAR_REGEX } from "./constants/birthYear";
import { ISO8601_DATE_REGEX } from "./constants/dates";
import { ERROR_MESSAGE_RACE_NOT_FOUND } from "./constants/errors";
import { notFoundBody } from "./utils/errors";

describe("RunnerController (e2e)", () => {
    let app: INestApplication;

    beforeEach(async () => {
        app = await initApp();
    });

    afterEach(async () => {
        await app.close();
    });

    it("Get runner list (GET /runners)", async () => {
        const response = await request(app.getHttpServer()).get("/runners");

        expect(response.statusCode).toBe(HttpStatus.OK);

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
                request(app.getHttpServer()).get("/races/1/runners"),

                // Get runners of a non-public race
                request(app.getHttpServer()).get("/races/5/runners"),

                // Get runners of a non-existing race
                request(app.getHttpServer()).get("/races/10/runners"),
            ]);

        expect(response.statusCode).toBe(HttpStatus.OK);

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

            for (const passage of runner.passages) {
                expect(passage).toContainAllKeys(["id", "time"]);

                expect(passage.id).toBeNumber();
                expect(passage.time).toBeDateString();
                expect(passage.time).toMatch(ISO8601_DATE_REGEX);
            }
        }

        for (const response of [nonPublicResponse, notFoundResponse]) {
            expect(response.statusCode).toBe(HttpStatus.NOT_FOUND);

            const json = JSON.parse(response.text);

            expect(json).toContainAllEntries(
                Object.entries(notFoundBody(ERROR_MESSAGE_RACE_NOT_FOUND)),
            );
        }
    });
});
