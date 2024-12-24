import { HttpStatus, INestApplication } from "@nestjs/common";
import request from "supertest";
import { afterEach, beforeEach, describe, expect, it } from "vitest";
import { AdminRace, AdminRaceWithRunnerCount, PublicRace } from "@live24hisere/core/types";
import { objectUtils } from "@live24hisere/utils";
import { initApp } from "./_init";
import { ADMIN_USER_ACCESS_TOKEN } from "./constants/accessToken";
import { ISO8601_DATE_REGEX } from "./constants/dates";
import {
  ERROR_MESSAGE_CANNOT_DELETE_RACE_WITH_RUNNERS,
  ERROR_MESSAGE_EDITION_ID_MUST_BE_NUMBER,
  ERROR_MESSAGE_EDITION_NOT_FOUND,
  ERROR_MESSAGE_RACE_ID_MUST_BE_NUMBER,
  ERROR_MESSAGE_RACE_NAME_ALREADY_EXISTS,
  ERROR_MESSAGE_RACE_NOT_FOUND,
} from "./constants/errors";
import { badRequestBody, notFoundBody } from "./utils/errors";

describe.skip("Race endpoints (e2e)", { concurrent: false }, () => {
  let app: INestApplication;

  beforeEach(async () => {
    app = await initApp();
  });

  afterEach(async () => {
    await app.close();
  });

  describe("RacesController (e2e)", () => {
    describe("Get race list (GET /races)", () => {
      it("Try to get races without edition query string param or with invalid param", async () => {
        const responses = await Promise.all([
          request(app.getHttpServer()).get("/races").expect(HttpStatus.BAD_REQUEST),
          request(app.getHttpServer()).get("/races?edition=invalid").expect(HttpStatus.BAD_REQUEST),
        ]);

        for (const response of responses) {
          const json = JSON.parse(response.text);

          expect(json).toEqual(badRequestBody("edition param must be provided in query string and must be numeric"));
        }
      });

      it("Get race list of an edition (GET /races?edition=6)", async () => {
        const response = await request(app.getHttpServer()).get("/races?edition=6").expect(HttpStatus.OK);

        const json = JSON.parse(response.text);

        expect(json.races).toBeArray();

        for (const race of json.races) {
          expect(race).toContainAllKeys([
            "id",
            "editionId",
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
        expect(json.races.map((race: PublicRace) => race.id)).toEqual([1, 4, 3, 2]);
      });

      it("Get race list of another edition (GET /races?edition=1)", async () => {
        const response = await request(app.getHttpServer()).get("/races?edition=1").expect(HttpStatus.OK);

        const json = JSON.parse(response.text);

        expect(json.races).toBeArray();

        // Test races order
        expect(json.races.map((race: PublicRace) => race.id)).toEqual([6, 7]);
      });

      it("Get race list of a non-existing edition (GET /races?edition=11)", async () => {
        const response = await request(app.getHttpServer()).get("/races?edition=11").expect(HttpStatus.OK);

        const json = JSON.parse(response.text);

        expect(json.races).toBeArray();
        expect(json.races).toBeEmpty();
      });
    });

    it("Get a race (GET /races/{id})", async () => {
      const [response, nonPublicResponse, notFoundResponse, invalidIdResponse] = await Promise.all([
        // Get existing public race
        request(app.getHttpServer()).get("/races/1").expect(HttpStatus.OK),

        // Get non-public race
        request(app.getHttpServer()).get("/races/5").expect(HttpStatus.NOT_FOUND),

        // Get non-existing race
        request(app.getHttpServer()).get("/races/100").expect(HttpStatus.NOT_FOUND),

        // Invalid ID format
        request(app.getHttpServer()).get("/races/invalid").expect(HttpStatus.BAD_REQUEST),
      ]);

      const json = JSON.parse(response.text);

      const race = json.race;

      expect(race).toBeObject();

      expect(race).toContainAllKeys([
        "id",
        "editionId",
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

        expect(json).toEqual(notFoundBody(ERROR_MESSAGE_RACE_NOT_FOUND));
      }

      const invalidIdJson = JSON.parse(invalidIdResponse.text);

      expect(invalidIdJson).toEqual(badRequestBody(ERROR_MESSAGE_RACE_ID_MUST_BE_NUMBER));
    });
  });

  describe("Admin RacesController (e2e)", () => {
    it("Get race list (GET /admin/races)", async () => {
      const response = await request(app.getHttpServer())
        .get("/admin/races")
        .set("Authorization", ADMIN_USER_ACCESS_TOKEN)
        .expect(HttpStatus.OK);

      const json = JSON.parse(response.text);

      const races: AdminRaceWithRunnerCount[] = json.races;

      expect(races).toBeArray();

      for (const race of races) {
        expect(race).toContainAllKeys([
          "id",
          "editionId",
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

      // Test that private race is present
      expect(races.map((race: AdminRace) => race.id).includes(5)).toBe(true);
    });

    describe("Get edition race list (GET /admin/editions/{id}/races)", () => {
      it("Try to get races of a non-existing edition", async () => {
        const response = await request(app.getHttpServer())
          .get("/admin/editions/11/races")
          .set("Authorization", ADMIN_USER_ACCESS_TOKEN)
          .expect(HttpStatus.NOT_FOUND);

        const json = JSON.parse(response.text);

        expect(json).toEqual(notFoundBody(ERROR_MESSAGE_EDITION_NOT_FOUND));
      });

      it("Try to get edition races with an invalid edition ID", async () => {
        const response = await request(app.getHttpServer())
          .get("/admin/editions/invalid/races")
          .set("Authorization", ADMIN_USER_ACCESS_TOKEN)
          .expect(HttpStatus.BAD_REQUEST);

        const json = JSON.parse(response.text);

        expect(json).toEqual(badRequestBody(ERROR_MESSAGE_EDITION_ID_MUST_BE_NUMBER));
      });

      it("Get edition races", async () => {
        const response = await request(app.getHttpServer())
          .get("/admin/editions/6/races")
          .set("Authorization", ADMIN_USER_ACCESS_TOKEN)
          .expect(HttpStatus.OK);

        const json = JSON.parse(response.text);

        const races: AdminRaceWithRunnerCount[] = json.races;

        expect(races).toBeArray();

        for (const race of races) {
          expect(race).toContainAllKeys([
            "id",
            "editionId",
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

        expect(races.map((race) => race.id)).toEqual([1, 4, 3, 2, 5]);
      });
    });

    it("Get a race (GET /admin/race/{id})", async () => {
      const [publicResponse, nonPublicResponse, notFoundResponse, invalidIdResponse] = await Promise.all([
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
          .get("/admin/races/100")
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
          "editionId",
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

      expect(notFoundJson).toEqual(notFoundBody(ERROR_MESSAGE_RACE_NOT_FOUND));

      const invalidIdJson = JSON.parse(invalidIdResponse.text);

      expect(invalidIdJson).toEqual(badRequestBody(ERROR_MESSAGE_RACE_ID_MUST_BE_NUMBER));
    });

    describe("Edit race order (PUT /admin/editions/{id}/races-order)", () => {
      it("Modify race order with all race IDs", async () => {
        const response = await request(app.getHttpServer())
          .put("/admin/editions/6/races-order")
          .send([5, 1, 3, 4, 2])
          .set("Authorization", ADMIN_USER_ACCESS_TOKEN)
          .expect(HttpStatus.NO_CONTENT);

        expect(response.text).toBeEmpty();

        const raceListResponse = await request(app.getHttpServer())
          .get("/admin/editions/6/races")
          .set("Authorization", ADMIN_USER_ACCESS_TOKEN);

        const json = JSON.parse(raceListResponse.text);

        expect(json.races).toBeArray();

        expect(json.races.map((race: AdminRace) => race.id)).toEqual([5, 1, 3, 4, 2]);
      });

      it("Modify race order with partial race IDs", async () => {
        const response = await request(app.getHttpServer())
          .put("/admin/editions/6/races-order")
          .send([1, 4, 3, 2])
          .set("Authorization", ADMIN_USER_ACCESS_TOKEN)
          .expect(HttpStatus.NO_CONTENT);

        expect(response.text).toBeEmpty();

        const raceListResponse = await request(app.getHttpServer())
          .get("/admin/editions/6/races")
          .set("Authorization", ADMIN_USER_ACCESS_TOKEN);

        const json = JSON.parse(raceListResponse.text);

        expect(json.races).toBeArray();

        expect(json.races.map((race: AdminRace) => race.id)).toEqual([1, 4, 3, 2, 5]);
      });
    });

    const raceToPost: Omit<AdminRace, "id"> = {
      editionId: 6,
      name: "Test e2e race",
      startTime: "2021-02-03T04:05:06.000Z",
      duration: 123456,
      initialDistance: "1000.123",
      lapDistance: "2000",
      isPublic: true,
    };

    let createdRaceId: number;

    describe("Create a race (POST /admin/races)", () => {
      it("Test invalid POST bodies", async () => {
        const responses = await Promise.all([
          // Post a race without body
          request(app.getHttpServer()).post("/admin/races").set("Authorization", ADMIN_USER_ACCESS_TOKEN),

          // Post a race without edition ID
          request(app.getHttpServer())
            .post("/admin/races")
            .send(objectUtils.excludeKeys(raceToPost, ["editionId"]))
            .set("Authorization", ADMIN_USER_ACCESS_TOKEN),

          // Post a race with an invalid edition ID type
          request(app.getHttpServer())
            .post("/admin/races")
            .send({ ...raceToPost, editionId: "invalid" })
            .set("Authorization", ADMIN_USER_ACCESS_TOKEN),

          // Post a race with a non-existing edition ID
          request(app.getHttpServer())
            .post("/admin/races")
            .send({ ...raceToPost, editionId: 123 })
            .set("Authorization", ADMIN_USER_ACCESS_TOKEN),

          // Post a race without name
          request(app.getHttpServer())
            .post("/admin/races")
            .send(objectUtils.excludeKeys(raceToPost, ["name"]))
            .set("Authorization", ADMIN_USER_ACCESS_TOKEN),

          // Post a race with an invalid name type
          request(app.getHttpServer())
            .post("/admin/races")
            .send({ ...raceToPost, name: 4 })
            .set("Authorization", ADMIN_USER_ACCESS_TOKEN),

          // Post a race with a too long name
          request(app.getHttpServer())
            .post("/admin/races")
            .send({
              ...raceToPost,
              name: "51 characters 51 characters 51 characters 51 charac",
            })
            .set("Authorization", ADMIN_USER_ACCESS_TOKEN),

          // Post a race without start time
          request(app.getHttpServer())
            .post("/admin/races")
            .send(objectUtils.excludeKeys(raceToPost, ["startTime"]))
            .set("Authorization", ADMIN_USER_ACCESS_TOKEN),

          // Post a race with an invalid start time type
          request(app.getHttpServer())
            .post("/admin/races")
            .send({
              ...raceToPost,
              startTime: "2020-01-01 00:00:00",
            })
            .set("Authorization", ADMIN_USER_ACCESS_TOKEN),

          // Post a race without duration
          request(app.getHttpServer())
            .post("/admin/races")
            .send(objectUtils.excludeKeys(raceToPost, ["duration"]))
            .set("Authorization", ADMIN_USER_ACCESS_TOKEN),

          // Post a race with an invalid duration type
          request(app.getHttpServer())
            .post("/admin/races")
            .send({
              ...raceToPost,
              duration: "invalid",
            })
            .set("Authorization", ADMIN_USER_ACCESS_TOKEN),

          // Post a race with a duration less than 0
          request(app.getHttpServer())
            .post("/admin/races")
            .send({
              ...raceToPost,
              duration: -1,
            })
            .set("Authorization", ADMIN_USER_ACCESS_TOKEN),

          // Post a race without initial distance
          request(app.getHttpServer())
            .post("/admin/races")
            .send(objectUtils.excludeKeys(raceToPost, ["initialDistance"]))
            .set("Authorization", ADMIN_USER_ACCESS_TOKEN),

          // Post a race with an invalid initial distance type
          request(app.getHttpServer())
            .post("/admin/races")
            .send({
              ...raceToPost,
              initialDistance: 1234,
            })
            .set("Authorization", ADMIN_USER_ACCESS_TOKEN),

          // Post a race with an initial distance less than 0
          request(app.getHttpServer())
            .post("/admin/races")
            .send({
              ...raceToPost,
              initialDistance: "-1",
            })
            .set("Authorization", ADMIN_USER_ACCESS_TOKEN),

          // Post a race without lap distance
          request(app.getHttpServer())
            .post("/admin/races")
            .send(objectUtils.excludeKeys(raceToPost, ["lapDistance"]))
            .set("Authorization", ADMIN_USER_ACCESS_TOKEN),

          // Post a race with an invalid lap distance type
          request(app.getHttpServer())
            .post("/admin/races")
            .send({
              ...raceToPost,
              lapDistance: 1234,
            })
            .set("Authorization", ADMIN_USER_ACCESS_TOKEN),

          // Post a race with a lap distance less than 0
          request(app.getHttpServer())
            .post("/admin/races")
            .send({
              ...raceToPost,
              lapDistance: "-1",
            })
            .set("Authorization", ADMIN_USER_ACCESS_TOKEN),

          // Post a race without isPublic
          request(app.getHttpServer())
            .post("/admin/races")
            .send(objectUtils.excludeKeys(raceToPost, ["isPublic"]))
            .set("Authorization", ADMIN_USER_ACCESS_TOKEN),

          // Post a race with an invalid isPublic type
          request(app.getHttpServer())
            .post("/admin/races")
            .send({
              ...raceToPost,
              isPublic: 1,
            })
            .set("Authorization", ADMIN_USER_ACCESS_TOKEN),
        ]);

        for (const response of responses) {
          expect(response.statusCode).toBe(HttpStatus.UNPROCESSABLE_ENTITY);

          const json = JSON.parse(response.text);

          expect(json).toContainAllKeys(["message", "error", "statusCode"]);

          expect(json.message).toBeArray();
          expect(json.error).toBe("Unprocessable Entity");
          expect(json.statusCode).toBe(HttpStatus.UNPROCESSABLE_ENTITY);
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
          "editionId",
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

      it("Try to post the same race again in the same edition", async () => {
        const response = await request(app.getHttpServer())
          .post("/admin/races")
          .send(raceToPost)
          .set("Authorization", ADMIN_USER_ACCESS_TOKEN)
          .expect(HttpStatus.BAD_REQUEST);

        const json = JSON.parse(response.text);

        expect(json).toEqual(badRequestBody(ERROR_MESSAGE_RACE_NAME_ALREADY_EXISTS));
      });

      it("Post the same race in another edition", async () => {
        const response = await request(app.getHttpServer())
          .post("/admin/races")
          .send({ ...raceToPost, editionId: 5 })
          .set("Authorization", ADMIN_USER_ACCESS_TOKEN)
          .expect(HttpStatus.CREATED);

        const json = JSON.parse(response.text);

        const raceId = json.race.id;

        await request(app.getHttpServer())
          .delete(`/admin/races/${raceId}`)
          .set("Authorization", ADMIN_USER_ACCESS_TOKEN)
          .expect(HttpStatus.NO_CONTENT);
      });

      it("Get race list, check order and test that the new race is present", async () => {
        const response = await request(app.getHttpServer())
          .get("/admin/editions/6/races")
          .set("Authorization", ADMIN_USER_ACCESS_TOKEN);

        const json = JSON.parse(response.text);

        // Test races order and test that the new race is present
        expect(json.races.map((race: AdminRace) => race.id)).toEqual([1, 4, 3, 2, 5, createdRaceId]);
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

        const afterAddRunnerResponse = await request(app.getHttpServer())
          .get(`/admin/races/${createdRaceId}`)
          .set("Authorization", ADMIN_USER_ACCESS_TOKEN)
          .expect(HttpStatus.OK);

        const afterAddRunnerJson = JSON.parse(afterAddRunnerResponse.text);

        expect(afterAddRunnerJson.race.runnerCount).toBe(1);
      });
    });

    describe("Edit a race (PATCH /admin/races/{id})", () => {
      it("Test invalid PATCH bodies", async () => {
        const responses = await Promise.all([
          // Patch a race with an invalid edition ID type
          request(app.getHttpServer())
            .patch(`/admin/races/${createdRaceId}`)
            .send({ editionId: "invalid" })
            .set("Authorization", ADMIN_USER_ACCESS_TOKEN),

          // Patch a race with a non-existing edition ID
          request(app.getHttpServer())
            .patch(`/admin/races/${createdRaceId}`)
            .send({ editionId: 123 })
            .set("Authorization", ADMIN_USER_ACCESS_TOKEN),

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
          expect(response.statusCode).toBe(HttpStatus.UNPROCESSABLE_ENTITY);

          const json = JSON.parse(response.text);

          expect(json).toContainAllKeys(["message", "error", "statusCode"]);

          expect(json.message).toBeArray();
          expect(json.error).toBe("Unprocessable Entity");
          expect(json.statusCode).toBe(HttpStatus.UNPROCESSABLE_ENTITY);
        }
      });

      describe("Try to change race edition where the new edition contains a race with the same name", () => {
        let raceId1: number;
        let raceId2: number;

        it("Create a race in edition 1", async () => {
          const response = await request(app.getHttpServer())
            .post("/admin/races")
            .send({
              editionId: 1,
              name: "Test e2e race",
              startTime: "2021-01-01T01:01:01.000Z",
              duration: 111111,
              initialDistance: "111",
              lapDistance: "1111",
              isPublic: true,
            })
            .set("Authorization", ADMIN_USER_ACCESS_TOKEN)
            .expect(HttpStatus.CREATED);

          raceId1 = JSON.parse(response.text).race.id;
        });

        it("Create a race in edition 2", async () => {
          const response = await request(app.getHttpServer())
            .post("/admin/races")
            .send({
              editionId: 2,
              name: "Test e2e race",
              startTime: "2022-02-02T02:02:02.000Z",
              duration: 222222,
              initialDistance: "222",
              lapDistance: "2222",
              isPublic: true,
            })
            .set("Authorization", ADMIN_USER_ACCESS_TOKEN)
            .expect(HttpStatus.CREATED);

          raceId2 = JSON.parse(response.text).race.id;
        });

        it("Try to change race edition from 1 to 2", async () => {
          const response = await request(app.getHttpServer())
            .patch(`/admin/races/${raceId1}`)
            .send({ editionId: 2 })
            .set("Authorization", ADMIN_USER_ACCESS_TOKEN)
            .expect(HttpStatus.BAD_REQUEST);

          const json = JSON.parse(response.text);

          expect(json).toEqual(badRequestBody(ERROR_MESSAGE_RACE_NAME_ALREADY_EXISTS));
        });

        it("Delete race 2", async () => {
          await request(app.getHttpServer())
            .delete(`/admin/races/${raceId2}`)
            .set("Authorization", ADMIN_USER_ACCESS_TOKEN)
            .expect(HttpStatus.NO_CONTENT);
        });

        it("Change race edition should work now", async () => {
          const response = await request(app.getHttpServer())
            .patch(`/admin/races/${raceId1}`)
            .send({ editionId: 2 })
            .set("Authorization", ADMIN_USER_ACCESS_TOKEN)
            .expect(HttpStatus.OK);

          const json = JSON.parse(response.text);

          expect(json.race.editionId).toBe(2);
        });

        it("Delete race 1", async () => {
          await request(app.getHttpServer())
            .delete(`/admin/races/${raceId1}`)
            .set("Authorization", ADMIN_USER_ACCESS_TOKEN)
            .expect(HttpStatus.NO_CONTENT);
        });
      });

      it("Test valid PATCH bodies", async () => {
        const values = [
          {
            patchValues: { editionId: 2 },
            expectedValues: { editionId: 2 },
          },
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
              editionId: 3,
              name: "Edited again",
              isPublic: false,
              startTime: "2023-04-05T06:07:08.000Z",
              duration: 345678,
              initialDistance: "1010.1",
              lapDistance: "2020.20",
            },
            expectedValues: {
              editionId: 3,
              name: "Edited again",
              isPublic: false,
              startTime: "2023-04-05T06:07:08.000Z",
              duration: 345678,
              initialDistance: "1010.100",
              lapDistance: "2020.200",
            },
          },
        ];

        for (const { patchValues, expectedValues } of values) {
          const response = await request(app.getHttpServer())
            .patch(`/admin/races/${createdRaceId}`)
            .send(patchValues)
            .set("Authorization", ADMIN_USER_ACCESS_TOKEN)
            .expect(HttpStatus.OK);

          const json = JSON.parse(response.text);

          expect(json.race).toContainEntries(Object.entries(expectedValues));
        }
      });
    });

    describe("Delete a race (DELETE /admin/races/{id}", () => {
      it("Ensure that the race cannot be deleted if it contains runners", async () => {
        const response = await request(app.getHttpServer())
          .delete(`/admin/races/${createdRaceId}`)
          .set("Authorization", ADMIN_USER_ACCESS_TOKEN)
          .expect(HttpStatus.BAD_REQUEST);

        const json = JSON.parse(response.text);

        expect(json).toEqual(badRequestBody(ERROR_MESSAGE_CANNOT_DELETE_RACE_WITH_RUNNERS));
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

        expect(json).toEqual(notFoundBody(ERROR_MESSAGE_RACE_NOT_FOUND));
      });
    });
  });
});
