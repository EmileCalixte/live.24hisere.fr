import { HttpStatus, INestApplication } from "@nestjs/common";
import request from "supertest";
import { afterEach, beforeEach, describe, expect, it } from "vitest";
import { Race } from "../../src/types/Race";
import { initApp } from "./_init";
import { ISO8601_DATE_REGEX } from "./constants/dates";
import {
    ERROR_MESSAGE_RACE_ID_MUST_BE_NUMBER,
    ERROR_MESSAGE_RACE_NOT_FOUND,
} from "./constants/errors";
import { badRequestBody, notFoundBody } from "./utils/errors";

describe("RacesController (e2e)", () => {
    let app: INestApplication;

    beforeEach(async () => {
        app = await initApp();
    });

    afterEach(async () => {
        await app.close();
    });

    it("Get race list (GET /races)", async () => {
        const response = await request(app.getHttpServer()).get("/races");

        expect(response.statusCode).toBe(HttpStatus.OK);

        const json = JSON.parse(response.text);

        expect(json.races).toBeArray();

        for (const race of json.races) {
            expect(race).toContainAllKeys([
                "id",
                "name",
                "startTime",
                "duration",
                "initialDistance",
                "lapDistance",
                "runnerCount",
            ]);

            expect(race.id).toBeNumber();
            expect(race.name).toBeString();
            expect(race.startTime).toBeDateString();
            expect(race.startTime).toMatch(ISO8601_DATE_REGEX);
            expect(race.duration).toBeNumber();
            expect(race.initialDistance).toBeString();
            expect(race.lapDistance).toBeString();
            expect(race.runnerCount).toBeNumber();
        }

        // Test races order and test that private race is not present
        expect(json.races.map((race: Race) => race.id)).toEqual([1, 4, 3, 2]);
    });

    it("Get a race (GET /races/{id})", async () => {
        const [
            response,
            nonPublicResponse,
            notFoundResponse,
            invalidIdResponse,
        ] = await Promise.all([
            // Get existing public race
            request(app.getHttpServer()).get("/races/1"),

            // Get non-public race
            request(app.getHttpServer()).get("/races/5"),

            // Get non-existing race
            request(app.getHttpServer()).get("/races/10"),

            // Invalid ID format
            request(app.getHttpServer()).get("/races/invalid"),
        ]);

        expect(response.statusCode).toBe(HttpStatus.OK);

        const json = JSON.parse(response.text);

        const race = json.race;

        expect(race).toBeObject();

        expect(race).toContainAllKeys([
            "id",
            "name",
            "startTime",
            "duration",
            "initialDistance",
            "lapDistance",
            "runnerCount",
        ]);

        expect(race.id).toBeNumber();
        expect(race.name).toBeString();
        expect(race.startTime).toBeDateString();
        expect(race.startTime).toMatch(ISO8601_DATE_REGEX);
        expect(race.duration).toBeNumber();
        expect(race.initialDistance).toBeString();
        expect(race.lapDistance).toBeString();
        expect(race.runnerCount).toBeNumber();

        for (const response of [nonPublicResponse, notFoundResponse]) {
            expect(response.statusCode).toBe(HttpStatus.NOT_FOUND);

            const json = JSON.parse(response.text);

            expect(json).toEqual(notFoundBody(ERROR_MESSAGE_RACE_NOT_FOUND));
        }

        expect(invalidIdResponse.statusCode).toBe(HttpStatus.BAD_REQUEST);

        const invalidIdJson = JSON.parse(invalidIdResponse.text);

        expect(invalidIdJson).toEqual(
            badRequestBody(ERROR_MESSAGE_RACE_ID_MUST_BE_NUMBER),
        );
    });
});
