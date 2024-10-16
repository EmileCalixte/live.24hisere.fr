import { HttpStatus, INestApplication } from "@nestjs/common";
import request from "supertest";
import { afterEach, beforeEach, describe, expect, it } from "vitest";
import { AdminRace, Race } from "../../src/types/Race";
import { excludeKeys } from "../../src/utils/misc.utils";
import { initApp } from "./_init";
import { ADMIN_USER_ACCESS_TOKEN } from "./constants/accessToken";
import { ISO8601_DATE_REGEX } from "./constants/dates";
import {
    ERROR_MESSAGE_CANNOT_DELETE_RACE_WITH_RUNNERS,
    ERROR_MESSAGE_RACE_ID_MUST_BE_NUMBER,
    ERROR_MESSAGE_RACE_NAME_ALREADY_EXISTS,
    ERROR_MESSAGE_RACE_NOT_FOUND,
} from "./constants/errors";
import { badRequestBody, notFoundBody } from "./utils/errors";

describe("Race endpoints (e2e)", { concurrent: false }, () => {
    let app: INestApplication;

    beforeEach(async () => {
        app = await initApp();
    });

    afterEach(async () => {
        await app.close();
    });

    describe("RacesController (e2e)", () => {
        it("Get race list (GET /races)", async () => {
            const response = await request(app.getHttpServer())
                .get("/races")
                .expect(HttpStatus.OK);

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
            expect(json.races.map((race: Race) => race.id)).toEqual([
                1, 4, 3, 2,
            ]);
        });

        it("Get a race (GET /races/{id})", async () => {
            const [
                response,
                nonPublicResponse,
                notFoundResponse,
                invalidIdResponse,
            ] = await Promise.all([
                // Get existing public race
                request(app.getHttpServer())
                    .get("/races/1")
                    .expect(HttpStatus.OK),

                // Get non-public race
                request(app.getHttpServer())
                    .get("/races/5")
                    .expect(HttpStatus.NOT_FOUND),

                // Get non-existing race
                request(app.getHttpServer())
                    .get("/races/10")
                    .expect(HttpStatus.NOT_FOUND),

                // Invalid ID format
                request(app.getHttpServer())
                    .get("/races/invalid")
                    .expect(HttpStatus.BAD_REQUEST),
            ]);

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
                const json = JSON.parse(response.text);

                expect(json).toEqual(
                    notFoundBody(ERROR_MESSAGE_RACE_NOT_FOUND),
                );
            }

            const invalidIdJson = JSON.parse(invalidIdResponse.text);

            expect(invalidIdJson).toEqual(
                badRequestBody(ERROR_MESSAGE_RACE_ID_MUST_BE_NUMBER),
            );
        });
    });

    describe("Admin RacesController (e2e)", () => {
        let app: INestApplication;

        beforeEach(async () => {
            app = await initApp();
        });

        afterEach(async () => {
            await app.close();
        });

        it("Get race list (GET /admin/races)", async () => {
            const response = await request(app.getHttpServer())
                .get("/admin/races")
                .set("Authorization", ADMIN_USER_ACCESS_TOKEN)
                .expect(HttpStatus.OK);

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
                    "isPublic",
                    "runnerCount",
                ]);

                expect(race.id).toBeNumber();
                expect(race.name).toBeString();
                expect(race.startTime).toBeDateString();
                expect(race.startTime).toMatch(ISO8601_DATE_REGEX);
                expect(race.duration).toBeNumber();
                expect(race.initialDistance).toBeString();
                expect(race.lapDistance).toBeString();
                expect(race.isPublic).toBeBoolean();
                expect(race.runnerCount).toBeNumber();
            }

            // Test races order and test that private race is present
            expect(json.races.map((race: Race) => race.id)).toEqual([
                1, 4, 3, 2, 5,
            ]);
        });

        it("Get a race (GET /admin/race/{id})", async () => {
            const [
                publicResponse,
                nonPublicResponse,
                notFoundResponse,
                invalidIdResponse,
            ] = await Promise.all([
                // Get existing public race
                request(app.getHttpServer())
                    .get("/admin/races/1")
                    .set("Authorization", ADMIN_USER_ACCESS_TOKEN)
                    .expect(HttpStatus.OK),

                // Get non-public race
                request(app.getHttpServer())
                    .get("/admin/races/5")
                    .set("Authorization", ADMIN_USER_ACCESS_TOKEN)
                    .expect(HttpStatus.OK),

                // Get non-existing race
                request(app.getHttpServer())
                    .get("/admin/races/10")
                    .set("Authorization", ADMIN_USER_ACCESS_TOKEN)
                    .expect(HttpStatus.NOT_FOUND),

                // Invalid ID format
                request(app.getHttpServer())
                    .get("/admin/races/invalid")
                    .set("Authorization", ADMIN_USER_ACCESS_TOKEN)
                    .expect(HttpStatus.BAD_REQUEST),
            ]);

            for (const response of [publicResponse, nonPublicResponse]) {
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
                    "isPublic",
                    "runnerCount",
                ]);

                expect(race.id).toBeNumber();
                expect(race.name).toBeString();
                expect(race.startTime).toBeDateString();
                expect(race.startTime).toMatch(ISO8601_DATE_REGEX);
                expect(race.duration).toBeNumber();
                expect(race.initialDistance).toBeString();
                expect(race.lapDistance).toBeString();
                expect(race.isPublic).toBeBoolean();
                expect(race.runnerCount).toBeNumber();
            }

            const notFoundJson = JSON.parse(notFoundResponse.text);

            expect(notFoundJson).toEqual(
                notFoundBody(ERROR_MESSAGE_RACE_NOT_FOUND),
            );

            const invalidIdJson = JSON.parse(invalidIdResponse.text);

            expect(invalidIdJson).toEqual(
                badRequestBody(ERROR_MESSAGE_RACE_ID_MUST_BE_NUMBER),
            );
        });

        describe("Edit race order (PUT /admin/races-order)", async () => {
            it("Modify race order with all race IDs", async () => {
                const response = await request(app.getHttpServer())
                    .put("/admin/races-order")
                    .send([5, 1, 3, 4, 2])
                    .set("Authorization", ADMIN_USER_ACCESS_TOKEN)
                    .expect(HttpStatus.NO_CONTENT);

                expect(response.text).toBeEmpty();

                const raceListResponse = await request(app.getHttpServer())
                    .get("/admin/races")
                    .set("Authorization", ADMIN_USER_ACCESS_TOKEN);

                const json = JSON.parse(raceListResponse.text);

                expect(json.races).toBeArray();

                expect(json.races.map((race: Race) => race.id)).toEqual([
                    5, 1, 3, 4, 2,
                ]);
            });

            it("Modify race order with partial race IDs", async () => {
                const response = await request(app.getHttpServer())
                    .put("/admin/races-order")
                    .send([1, 4, 3, 2])
                    .set("Authorization", ADMIN_USER_ACCESS_TOKEN)
                    .expect(HttpStatus.NO_CONTENT);

                expect(response.text).toBeEmpty();

                const raceListResponse = await request(app.getHttpServer())
                    .get("/admin/races")
                    .set("Authorization", ADMIN_USER_ACCESS_TOKEN);

                const json = JSON.parse(raceListResponse.text);

                expect(json.races).toBeArray();

                expect(json.races.map((race: Race) => race.id)).toEqual([
                    1, 4, 3, 2, 5,
                ]);
            });
        });

        const raceToPost: Omit<AdminRace, "id"> = {
            name: "Test e2e race",
            startTime: "2021-02-03T04:05:06.000Z",
            duration: 123456,
            initialDistance: "1000.123",
            lapDistance: "2000",
            isPublic: true,
        };

        let createdRaceId: number;

        describe("Create a race (POST /admin/races)", async () => {
            it("Test invalid POST bodies", async () => {
                const responses = await Promise.all([
                    // Post a race without body
                    request(app.getHttpServer())
                        .post("/admin/races")
                        .set("Authorization", ADMIN_USER_ACCESS_TOKEN),

                    // Post a race without name
                    request(app.getHttpServer())
                        .post("/admin/races")
                        .send(excludeKeys(raceToPost, ["name"]))
                        .set("Authorization", ADMIN_USER_ACCESS_TOKEN),

                    // Post a race with an invalid name type
                    request(app.getHttpServer())
                        .post("/admin/races")
                        .send({ ...excludeKeys(raceToPost, ["name"]), name: 4 })
                        .set("Authorization", ADMIN_USER_ACCESS_TOKEN),

                    // Post a race with a too long name
                    request(app.getHttpServer())
                        .post("/admin/races")
                        .send({
                            ...excludeKeys(raceToPost, ["name"]),
                            name: "51 characters 51 characters 51 characters 51 charac",
                        })
                        .set("Authorization", ADMIN_USER_ACCESS_TOKEN),

                    // Post a race without start time
                    request(app.getHttpServer())
                        .post("/admin/races")
                        .send(excludeKeys(raceToPost, ["startTime"]))
                        .set("Authorization", ADMIN_USER_ACCESS_TOKEN),

                    // Post a race with an invalid start time type
                    request(app.getHttpServer())
                        .post("/admin/races")
                        .send({
                            ...excludeKeys(raceToPost, ["startTime"]),
                            startTime: "2020-01-01 00:00:00",
                        })
                        .set("Authorization", ADMIN_USER_ACCESS_TOKEN),

                    // Post a race without duration
                    request(app.getHttpServer())
                        .post("/admin/races")
                        .send(excludeKeys(raceToPost, ["duration"]))
                        .set("Authorization", ADMIN_USER_ACCESS_TOKEN),

                    // Post a race with an invalid duration type
                    request(app.getHttpServer())
                        .post("/admin/races")
                        .send({
                            ...excludeKeys(raceToPost, ["duration"]),
                            duration: "invalid",
                        })
                        .set("Authorization", ADMIN_USER_ACCESS_TOKEN),

                    // Post a race with a duration less than 0
                    request(app.getHttpServer())
                        .post("/admin/races")
                        .send({
                            ...excludeKeys(raceToPost, ["duration"]),
                            duration: -1,
                        })
                        .set("Authorization", ADMIN_USER_ACCESS_TOKEN),

                    // Post a race without initial distance
                    request(app.getHttpServer())
                        .post("/admin/races")
                        .send(excludeKeys(raceToPost, ["initialDistance"]))
                        .set("Authorization", ADMIN_USER_ACCESS_TOKEN),

                    // Post a race with an invalid initial distance type
                    request(app.getHttpServer())
                        .post("/admin/races")
                        .send({
                            ...excludeKeys(raceToPost, ["initialDistance"]),
                            initialDistance: 1234,
                        })
                        .set("Authorization", ADMIN_USER_ACCESS_TOKEN),

                    // Post a race with an initial distance less than 0
                    request(app.getHttpServer())
                        .post("/admin/races")
                        .send({
                            ...excludeKeys(raceToPost, ["initialDistance"]),
                            initialDistance: "-1",
                        })
                        .set("Authorization", ADMIN_USER_ACCESS_TOKEN),

                    // Post a race without lap distance
                    request(app.getHttpServer())
                        .post("/admin/races")
                        .send(excludeKeys(raceToPost, ["lapDistance"]))
                        .set("Authorization", ADMIN_USER_ACCESS_TOKEN),

                    // Post a race with an invalid lap distance type
                    request(app.getHttpServer())
                        .post("/admin/races")
                        .send({
                            ...excludeKeys(raceToPost, ["lapDistance"]),
                            lapDistance: 1234,
                        })
                        .set("Authorization", ADMIN_USER_ACCESS_TOKEN),

                    // Post a race with a lap distance less than 0
                    request(app.getHttpServer())
                        .post("/admin/races")
                        .send({
                            ...excludeKeys(raceToPost, ["lapDistance"]),
                            lapDistance: "-1",
                        })
                        .set("Authorization", ADMIN_USER_ACCESS_TOKEN),

                    // Post a race without isPublic
                    request(app.getHttpServer())
                        .post("/admin/races")
                        .send(excludeKeys(raceToPost, ["isPublic"]))
                        .set("Authorization", ADMIN_USER_ACCESS_TOKEN),

                    // Post a race with an invalid isPublic type
                    request(app.getHttpServer())
                        .post("/admin/races")
                        .send({
                            ...excludeKeys(raceToPost, ["isPublic"]),
                            isPublic: 1,
                        })
                        .set("Authorization", ADMIN_USER_ACCESS_TOKEN),
                ]);

                for (const response of responses) {
                    expect(response.statusCode).toBe(
                        HttpStatus.UNPROCESSABLE_ENTITY,
                    );

                    const json = JSON.parse(response.text);

                    expect(json).toContainAllKeys([
                        "message",
                        "error",
                        "statusCode",
                    ]);

                    expect(json.message).toBeArray();
                    expect(json.error).toBe("Unprocessable Entity");
                    expect(json.statusCode).toBe(
                        HttpStatus.UNPROCESSABLE_ENTITY,
                    );
                }
            });

            it("Test valid POST body", async () => {
                const response = await request(app.getHttpServer())
                    .post("/admin/races")
                    .send(raceToPost)
                    .set("Authorization", ADMIN_USER_ACCESS_TOKEN)
                    .expect(HttpStatus.CREATED);

                const json = JSON.parse(response.text);

                const createdRace = json.race;

                expect(createdRace).toContainAllKeys([
                    "id",
                    "name",
                    "startTime",
                    "duration",
                    "initialDistance",
                    "lapDistance",
                    "isPublic",
                    "runnerCount",
                ]);

                createdRaceId = json.race.id;

                expect(createdRace.name).toBe(raceToPost.name);
                expect(createdRace.startTime).toBe(raceToPost.startTime);
                expect(createdRace.duration).toBe(raceToPost.duration);
                expect(createdRace.initialDistance).toBe("1000.123");
                expect(createdRace.lapDistance).toBe("2000.000");
                expect(createdRace.isPublic).toBe(raceToPost.isPublic);
                expect(createdRace.runnerCount).toBe(0);
            });

            it("Try to post the same race again", async () => {
                const response = await request(app.getHttpServer())
                    .post("/admin/races")
                    .send(raceToPost)
                    .set("Authorization", ADMIN_USER_ACCESS_TOKEN)
                    .expect(HttpStatus.BAD_REQUEST);

                const json = JSON.parse(response.text);

                expect(json).toEqual(
                    badRequestBody(ERROR_MESSAGE_RACE_NAME_ALREADY_EXISTS),
                );
            });

            it("Get race list, check order and test that the new race is present", async () => {
                const response = await request(app.getHttpServer())
                    .get("/admin/races")
                    .set("Authorization", ADMIN_USER_ACCESS_TOKEN);

                const json = JSON.parse(response.text);

                // Test races order and test that the new race is present
                expect(json.races.map((race: Race) => race.id)).toEqual([
                    1,
                    4,
                    3,
                    2,
                    5,
                    createdRaceId,
                ]);
            });

            it("Add a runner to the race", async () => {
                await request(app.getHttpServer())
                    .post("/admin/runners")
                    .send({
                        id: 123456,
                        firstname: "Test",
                        lastname: "e2e",
                        gender: "M",
                        birthYear: 1970,
                        stopped: false,
                        raceId: createdRaceId,
                    })
                    .set("Authorization", ADMIN_USER_ACCESS_TOKEN)
                    .expect(HttpStatus.CREATED);

                const afterAddRunnerResponse = await request(
                    app.getHttpServer(),
                )
                    .get(`/admin/races/${createdRaceId}`)
                    .set("Authorization", ADMIN_USER_ACCESS_TOKEN)
                    .expect(HttpStatus.OK);

                const afterAddRunnerJson = JSON.parse(
                    afterAddRunnerResponse.text,
                );

                expect(afterAddRunnerJson.race.runnerCount).toBe(1);
            });
        });

        describe("Edit a race (PATCH /admin/races/{id})", async () => {
            it("Test invalid PATCH bodies", async () => {
                const responses = await Promise.all([
                    // Patch a race with an invalid name type
                    request(app.getHttpServer())
                        .patch(`/admin/races/${createdRaceId}`)
                        .send({ name: 4 })
                        .set("Authorization", ADMIN_USER_ACCESS_TOKEN),

                    // Patch a race with a too long name
                    request(app.getHttpServer())
                        .patch(`/admin/races/${createdRaceId}`)
                        .send({
                            name: "51 characters 51 characters 51 characters 51 charac",
                        })
                        .set("Authorization", ADMIN_USER_ACCESS_TOKEN),

                    // Patch a race with an invalid start time type
                    request(app.getHttpServer())
                        .patch(`/admin/races/${createdRaceId}`)
                        .send({
                            startTime: "2020-01-01 00:00:00",
                        })
                        .set("Authorization", ADMIN_USER_ACCESS_TOKEN),

                    // Patch a race with an invalid duration type
                    request(app.getHttpServer())
                        .patch(`/admin/races/${createdRaceId}`)
                        .send({
                            duration: "invalid",
                        })
                        .set("Authorization", ADMIN_USER_ACCESS_TOKEN),

                    // Patch a race with a duration less than 0
                    request(app.getHttpServer())
                        .patch(`/admin/races/${createdRaceId}`)
                        .send({
                            duration: -1,
                        })
                        .set("Authorization", ADMIN_USER_ACCESS_TOKEN),

                    // Patch a race with an invalid initial distance type
                    request(app.getHttpServer())
                        .patch(`/admin/races/${createdRaceId}`)
                        .send({
                            initialDistance: 1234,
                        })
                        .set("Authorization", ADMIN_USER_ACCESS_TOKEN),

                    // Patch a race with an initial distance less than 0
                    request(app.getHttpServer())
                        .patch(`/admin/races/${createdRaceId}`)
                        .send({
                            initialDistance: "-1",
                        })
                        .set("Authorization", ADMIN_USER_ACCESS_TOKEN),

                    // Patch a race with an invalid lap distance type
                    request(app.getHttpServer())
                        .patch(`/admin/races/${createdRaceId}`)
                        .send({
                            lapDistance: 1234,
                        })
                        .set("Authorization", ADMIN_USER_ACCESS_TOKEN),

                    // Patch a race with a lap distance less than 0
                    request(app.getHttpServer())
                        .patch(`/admin/races/${createdRaceId}`)
                        .send({
                            lapDistance: "-1",
                        })
                        .set("Authorization", ADMIN_USER_ACCESS_TOKEN),

                    // Patch a race with an invalid isPublic type
                    request(app.getHttpServer())
                        .patch(`/admin/races/${createdRaceId}`)
                        .send({
                            isPublic: 1,
                        })
                        .set("Authorization", ADMIN_USER_ACCESS_TOKEN),
                ]);

                for (const response of responses) {
                    expect(response.statusCode).toBe(
                        HttpStatus.UNPROCESSABLE_ENTITY,
                    );

                    const json = JSON.parse(response.text);

                    expect(json).toContainAllKeys([
                        "message",
                        "error",
                        "statusCode",
                    ]);

                    expect(json.message).toBeArray();
                    expect(json.error).toBe("Unprocessable Entity");
                    expect(json.statusCode).toBe(
                        HttpStatus.UNPROCESSABLE_ENTITY,
                    );
                }
            });

            it("Test valid PATCH bodies", async () => {
                const toto = [
                    {
                        patchValues: { name: "Edited race name" },
                        expectedValues: { name: "Edited race name" },
                    },
                    {
                        patchValues: { startTime: "2022-03-04T05:06:07.000Z" },
                        expectedValues: {
                            startTime: "2022-03-04T05:06:07.000Z",
                        },
                    },
                    {
                        patchValues: { duration: 234567 },
                        expectedValues: {
                            duration: 234567,
                        },
                    },
                    {
                        patchValues: { initialDistance: "1111" },
                        expectedValues: {
                            initialDistance: "1111.000",
                        },
                    },
                    {
                        patchValues: { initialDistance: "222.345" },
                        expectedValues: {
                            initialDistance: "222.345",
                        },
                    },
                    {
                        patchValues: { isPublic: false },
                        expectedValues: {
                            isPublic: false,
                        },
                    },
                    {
                        patchValues: {
                            name: "Edited again",
                            isPublic: false,
                            startTime: "2023-04-05T06:07:08.000Z",
                            duration: 345678,
                            initialDistance: "1010.1",
                            lapDistance: "2020.20",
                        },
                        expectedValues: {
                            name: "Edited again",
                            isPublic: false,
                            startTime: "2023-04-05T06:07:08.000Z",
                            duration: 345678,
                            initialDistance: "1010.100",
                            lapDistance: "2020.200",
                        },
                    },
                ];

                for (const titi of toto) {
                    const response = await request(app.getHttpServer())
                        .patch(`/admin/races/${createdRaceId}`)
                        .send(titi.patchValues)
                        .set("Authorization", ADMIN_USER_ACCESS_TOKEN)
                        .expect(HttpStatus.OK);

                    const json = JSON.parse(response.text);

                    expect(json.race).toContainEntries(
                        Object.entries(titi.expectedValues),
                    );
                }
            });
        });

        describe("Delete a race (DELETE /admin/races/{id}", async () => {
            it("Ensure that the race cannot be deleted if it contains runners", async () => {
                const response = await request(app.getHttpServer())
                    .delete(`/admin/races/${createdRaceId}`)
                    .set("Authorization", ADMIN_USER_ACCESS_TOKEN)
                    .expect(HttpStatus.BAD_REQUEST);

                const json = JSON.parse(response.text);

                expect(json).toEqual(
                    badRequestBody(
                        ERROR_MESSAGE_CANNOT_DELETE_RACE_WITH_RUNNERS,
                    ),
                );
            });

            it("Delete runner", async () => {
                await request(app.getHttpServer())
                    .delete("/admin/runners/123456")
                    .set("Authorization", ADMIN_USER_ACCESS_TOKEN)
                    .expect(HttpStatus.NO_CONTENT);
            });

            it("Delete race", async () => {
                const response = await request(app.getHttpServer())
                    .delete(`/admin/races/${createdRaceId}`)
                    .set("Authorization", ADMIN_USER_ACCESS_TOKEN)
                    .expect(HttpStatus.NO_CONTENT);

                expect(response.text).toBeEmpty();
            });

            it("Try to delete the same race again", async () => {
                const response = await request(app.getHttpServer())
                    .delete(`/admin/races/${createdRaceId}`)
                    .set("Authorization", ADMIN_USER_ACCESS_TOKEN)
                    .expect(HttpStatus.NOT_FOUND);

                const json = JSON.parse(response.text);

                expect(json).toEqual(
                    notFoundBody(ERROR_MESSAGE_RACE_NOT_FOUND),
                );
            });
        });
    });
});
