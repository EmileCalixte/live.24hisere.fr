import { HttpStatus, INestApplication } from "@nestjs/common";
import request from "supertest";
import { afterEach, beforeEach, describe, expect, it } from "vitest";
import { Runner } from "@live24hisere/core/types";
import { objectUtils } from "@live24hisere/utils";
import { initApp } from "./_init";
import { ADMIN_USER_ACCESS_TOKEN } from "./constants/accessToken";
import { BIRTH_YEAR_REGEX } from "./constants/birthYear";
import { ISO8601_DATE_REGEX } from "./constants/dates";
import {
  ERROR_MESSAGE_RACE_NOT_FOUND,
  ERROR_MESSAGE_RUNNER_ID_ALREADY_EXISTS,
  ERROR_MESSAGE_RUNNER_ID_MUST_BE_NUMBER,
  ERROR_MESSAGE_RUNNER_NOT_FOUND,
} from "./constants/errors";
import { badRequestBody, notFoundBody } from "./utils/errors";

describe("Runner endpoints (e2e)", { concurrent: false }, () => {
  let app: INestApplication;

  beforeEach(async () => {
    app = await initApp();
  });

  afterEach(async () => {
    await app.close();
  });

  describe("RunnersController (e2e)", () => {
    it("Get runner list (GET /runners)", async () => {
      const response = await request(app.getHttpServer()).get("/runners").expect(HttpStatus.OK);

      const json = JSON.parse(response.text);

      expect(json.runners).toBeArray();

      for (const runner of json.runners) {
        expect(runner).toContainAllKeys(["id", "firstname", "lastname", "gender", "birthYear", "stopped", "raceId"]);

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
      const [response, nonPublicResponse, notFoundResponse] = await Promise.all([
        // Get runners of an existing public race
        request(app.getHttpServer()).get("/races/1/runners").expect(HttpStatus.OK),

        // Get runners of a non-public race
        request(app.getHttpServer()).get("/races/5/runners").expect(HttpStatus.NOT_FOUND),

        // Get runners of a non-existing race
        request(app.getHttpServer()).get("/races/100/runners").expect(HttpStatus.NOT_FOUND),
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

          if (previousPassageTime !== null && previousPassageTime.getTime() > passageTime.getTime()) {
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

  describe("Admin RunnersController (e2e)", async () => {
    it("Get runner list (GET /admin/runners)", async () => {
      const response = await request(app.getHttpServer())
        .get("/runners")
        .set("Authorization", ADMIN_USER_ACCESS_TOKEN)
        .expect(HttpStatus.OK);

      const json = JSON.parse(response.text);

      expect(json.runners).toBeArray();

      for (const runner of json.runners) {
        expect(runner).toContainAllKeys(["id", "firstname", "lastname", "gender", "birthYear", "stopped", "raceId"]);

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

    it("Get a runner (GET /admin/runners/{id})", async () => {
      const [publicRunnerResponse, privateRunnerResponse, notFoundResponse, invalidIdResponse] = await Promise.all([
        // Get a runner which is in a public race
        request(app.getHttpServer())
          .get("/admin/runners/1")
          .set("Authorization", ADMIN_USER_ACCESS_TOKEN)
          .expect(HttpStatus.OK),

        // Get a runner which is in a private race
        request(app.getHttpServer())
          .get("/admin/runners/2001")
          .set("Authorization", ADMIN_USER_ACCESS_TOKEN)
          .expect(HttpStatus.OK),

        // Get an non-existing runner
        request(app.getHttpServer())
          .get("/admin/runners/404404")
          .set("Authorization", ADMIN_USER_ACCESS_TOKEN)
          .expect(HttpStatus.NOT_FOUND),

        // Get a runner with an invalid ID format
        request(app.getHttpServer())
          .get("/admin/runners/invalid")
          .set("Authorization", ADMIN_USER_ACCESS_TOKEN)
          .expect(HttpStatus.BAD_REQUEST),
      ]);

      for (const response of [publicRunnerResponse, privateRunnerResponse]) {
        const json = JSON.parse(response.text);

        const runner = json.runner;

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
          expect(passage).toContainAllKeys(["id", "detectionId", "importTime", "time", "isHidden"]);

          expect(passage.id).toBeNumber();
          expect(passage.detectionId).toBeOneOf([expect.any(Number), null]);

          if (passage.detectionId !== null) {
            expect(passage.importTime).toBeDateString();
            expect(passage.importTime).toMatch(ISO8601_DATE_REGEX);
          } else {
            expect(passage.importTime).toBeNull();
          }

          expect(passage.time).toBeDateString();
          expect(passage.time).toMatch(ISO8601_DATE_REGEX);
          expect(passage.isHidden).toBeBoolean();
        }
      }

      expect(JSON.parse(notFoundResponse.text)).toEqual(notFoundBody(ERROR_MESSAGE_RUNNER_NOT_FOUND));

      expect(JSON.parse(invalidIdResponse.text)).toEqual(badRequestBody(ERROR_MESSAGE_RUNNER_ID_MUST_BE_NUMBER));
    });

    const runnersToPost: Array<Omit<Runner, "birthYear"> & { birthYear: number | string }> = [
      {
        id: 1234567,
        firstname: "e2e firstname 1",
        lastname: "e2e lastname 1",
        gender: "M",
        birthYear: "1970",
        stopped: false,
        raceId: 1,
      },
      {
        id: 1234568,
        firstname: "e2e firstname 2",
        lastname: "e2e lastname 2",
        gender: "F",
        birthYear: 1970,
        stopped: false,
        raceId: 1,
      },
    ];

    const runnerPatchId1 = 1234569;
    const runnerPatchId2 = 1234570;
    const runnerPatchId3 = 1234571;

    describe("Create a runner (POST /admin/runners)", async () => {
      it("Test invalid POST bodies", async () => {
        const runnerToPost = runnersToPost[0];

        const responses = await Promise.all([
          // Post a runner without body
          request(app.getHttpServer()).post("/admin/runners").set("Authorization", ADMIN_USER_ACCESS_TOKEN),

          // Post a runner without ID
          request(app.getHttpServer())
            .post("/admin/runners")
            .send(objectUtils.excludeKeys(runnerToPost, ["id"]))
            .set("Authorization", ADMIN_USER_ACCESS_TOKEN),

          // Post a runner with an invalid id type
          request(app.getHttpServer())
            .post("/admin/runners")
            .send({ ...runnerToPost, id: "invalid" })
            .set("Authorization", ADMIN_USER_ACCESS_TOKEN),

          // Post a runner with a negative id
          request(app.getHttpServer())
            .post("/admin/runners")
            .send({ ...runnerToPost, id: -1 })
            .set("Authorization", ADMIN_USER_ACCESS_TOKEN),

          // Post a runner with id 0
          request(app.getHttpServer())
            .post("/admin/runners")
            .send({ ...runnerToPost, id: 0 })
            .set("Authorization", ADMIN_USER_ACCESS_TOKEN),

          // Post a runner without firstname
          request(app.getHttpServer())
            .post("/admin/runners")
            .send(objectUtils.excludeKeys(runnerToPost, ["firstname"]))
            .set("Authorization", ADMIN_USER_ACCESS_TOKEN),

          // Post a runner with an invalid firstname type
          request(app.getHttpServer())
            .post("/admin/runners")
            .send({ ...runnerToPost, firstname: 123 })
            .set("Authorization", ADMIN_USER_ACCESS_TOKEN),

          // Post a runner with a too long firstname
          request(app.getHttpServer())
            .post("/admin/runners")
            .send({
              ...runnerToPost,
              firstname:
                "256 characters 256 characters 256 characters 256 characters 256 characters 256 characters 256 characters 256 characters 256 characters 256 characters 256 characters 256 characters 256 characters 256 characters 256 characters 256 characters 256 characters 2",
            })
            .set("Authorization", ADMIN_USER_ACCESS_TOKEN),

          // Post a runner without lastname
          request(app.getHttpServer())
            .post("/admin/runners")
            .send(objectUtils.excludeKeys(runnerToPost, ["lastname"]))
            .set("Authorization", ADMIN_USER_ACCESS_TOKEN),

          // Post a runner with an invalid lastname type
          request(app.getHttpServer())
            .post("/admin/runners")
            .send({ ...runnerToPost, lastname: 123 })
            .set("Authorization", ADMIN_USER_ACCESS_TOKEN),

          // Post a runner with a too long lastname
          request(app.getHttpServer())
            .post("/admin/runners")
            .send({
              ...runnerToPost,
              lastname:
                "256 characters 256 characters 256 characters 256 characters 256 characters 256 characters 256 characters 256 characters 256 characters 256 characters 256 characters 256 characters 256 characters 256 characters 256 characters 256 characters 256 characters 2",
            })
            .set("Authorization", ADMIN_USER_ACCESS_TOKEN),

          // Post a runner without gender
          request(app.getHttpServer())
            .post("/admin/runners")
            .send(objectUtils.excludeKeys(runnerToPost, ["lastname"]))
            .set("Authorization", ADMIN_USER_ACCESS_TOKEN),

          // Post a runner with an invalid gender type
          request(app.getHttpServer())
            .post("/admin/runners")
            .send({ ...runnerToPost, gender: 123 })
            .set("Authorization", ADMIN_USER_ACCESS_TOKEN),

          // Post a runner with an invalid gender
          request(app.getHttpServer())
            .post("/admin/runners")
            .send({ ...runnerToPost, gender: "U" })
            .set("Authorization", ADMIN_USER_ACCESS_TOKEN),

          // Post a runner without birth year
          request(app.getHttpServer())
            .post("/admin/runners")
            .send(objectUtils.excludeKeys(runnerToPost, ["birthYear"]))
            .set("Authorization", ADMIN_USER_ACCESS_TOKEN),

          // Post a runner with an invalid birth year type
          request(app.getHttpServer())
            .post("/admin/runners")
            .send({ ...runnerToPost, birthYear: "invalid" })
            .set("Authorization", ADMIN_USER_ACCESS_TOKEN),

          // Post a runner with a too low birth year
          request(app.getHttpServer())
            .post("/admin/runners")
            .send({ ...runnerToPost, birthYear: "1899" })
            .set("Authorization", ADMIN_USER_ACCESS_TOKEN),

          // Post a runner with a too high birth year
          request(app.getHttpServer())
            .post("/admin/runners")
            .send({
              ...runnerToPost,
              birthYear: `${new Date().getFullYear() + 1}`,
            })
            .set("Authorization", ADMIN_USER_ACCESS_TOKEN),

          // Post a runner without stopped
          request(app.getHttpServer())
            .post("/admin/runners")
            .send(objectUtils.excludeKeys(runnerToPost, ["stopped"]))
            .set("Authorization", ADMIN_USER_ACCESS_TOKEN),

          // Post a runner with an invalid stopped type
          request(app.getHttpServer())
            .post("/admin/runners")
            .send({ ...runnerToPost, stopped: 123 })
            .set("Authorization", ADMIN_USER_ACCESS_TOKEN),

          // Post a runner without race ID
          request(app.getHttpServer())
            .post("/admin/runners")
            .send(objectUtils.excludeKeys(runnerToPost, ["raceId"]))
            .set("Authorization", ADMIN_USER_ACCESS_TOKEN),

          // Post a runner with an invalid race ID type
          request(app.getHttpServer())
            .post("/admin/runners")
            .send({ ...runnerToPost, raceId: "invalid" })
            .set("Authorization", ADMIN_USER_ACCESS_TOKEN),

          // Post a runner with a non-existing race ID
          request(app.getHttpServer())
            .post("/admin/runners")
            .send({ ...runnerToPost, raceId: 123 })
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

      it("Try to create a runner with already existing ID", async () => {
        const runnerToPost = runnersToPost[0];

        const response = await request(app.getHttpServer())
          .post("/admin/runners")
          .send({ ...runnerToPost, id: 1 })
          .set("Authorization", ADMIN_USER_ACCESS_TOKEN)
          .expect(HttpStatus.BAD_REQUEST);

        expect(JSON.parse(response.text)).toEqual(badRequestBody(ERROR_MESSAGE_RUNNER_ID_ALREADY_EXISTS));
      });

      it("Test valid POST bodies", async () => {
        for (const runnerToPost of runnersToPost) {
          const response = await request(app.getHttpServer())
            .post("/admin/runners")
            .send(runnerToPost)
            .set("Authorization", ADMIN_USER_ACCESS_TOKEN)
            .expect(HttpStatus.CREATED);

          const json = JSON.parse(response.text);

          const createdRunner = json.runner;

          expect(createdRunner).toContainAllKeys([
            "id",
            "firstname",
            "lastname",
            "gender",
            "birthYear",
            "stopped",
            "raceId",
            "passages",
          ]);

          expect(createdRunner.id).toBeNumber();
          expect(createdRunner.firstname).toBeString();
          expect(createdRunner.lastname).toBeString();
          expect(createdRunner.gender).toBeOneOf(["M", "F"]);
          expect(createdRunner.birthYear).toBeString();
          expect(createdRunner.birthYear.length).toBe(4);
          expect(createdRunner.birthYear).toMatch(BIRTH_YEAR_REGEX);
          expect(createdRunner.stopped).toBeBoolean();
          expect(createdRunner.raceId).toBeNumber();
          expect(createdRunner.passages).toBeArray();
          expect(createdRunner.passages.length).toBe(0);
        }
      });
    });

    describe("Edit a runner (PATCH /admin/runners)", async () => {
      const runnerId = runnersToPost[0].id;

      it("Test invalid PATCH bodies", async () => {
        const responses = await Promise.all([
          // Patch a runner with an invalid id type
          request(app.getHttpServer())
            .patch(`/admin/runners/${runnerId}`)
            .send({ id: "invalid" })
            .set("Authorization", ADMIN_USER_ACCESS_TOKEN),

          // Patch a runner with a negative id
          request(app.getHttpServer())
            .patch(`/admin/runners/${runnerId}`)
            .send({ id: -1 })
            .set("Authorization", ADMIN_USER_ACCESS_TOKEN),

          // Patch a runner with id 0
          request(app.getHttpServer())
            .patch(`/admin/runners/${runnerId}`)
            .send({ id: 0 })
            .set("Authorization", ADMIN_USER_ACCESS_TOKEN),

          // Patch a runner with an invalid firstname type
          request(app.getHttpServer())
            .patch(`/admin/runners/${runnerId}`)
            .send({ firstname: 123 })
            .set("Authorization", ADMIN_USER_ACCESS_TOKEN),

          // Patch a runner with a too long firstname
          request(app.getHttpServer())
            .patch(`/admin/runners/${runnerId}`)
            .send({
              firstname:
                "256 characters 256 characters 256 characters 256 characters 256 characters 256 characters 256 characters 256 characters 256 characters 256 characters 256 characters 256 characters 256 characters 256 characters 256 characters 256 characters 256 characters 2",
            })
            .set("Authorization", ADMIN_USER_ACCESS_TOKEN),

          // Patch a runner with an invalid lastname type
          request(app.getHttpServer())
            .patch(`/admin/runners/${runnerId}`)
            .send({ lastname: 123 })
            .set("Authorization", ADMIN_USER_ACCESS_TOKEN),

          // Patch a runner with a too long lastname
          request(app.getHttpServer())
            .patch(`/admin/runners/${runnerId}`)
            .send({
              lastname:
                "256 characters 256 characters 256 characters 256 characters 256 characters 256 characters 256 characters 256 characters 256 characters 256 characters 256 characters 256 characters 256 characters 256 characters 256 characters 256 characters 256 characters 2",
            })
            .set("Authorization", ADMIN_USER_ACCESS_TOKEN),

          // Patch a runner with an invalid gender type
          request(app.getHttpServer())
            .patch(`/admin/runners/${runnerId}`)
            .send({ gender: 123 })
            .set("Authorization", ADMIN_USER_ACCESS_TOKEN),

          // Patch a runner with an invalid gender
          request(app.getHttpServer())
            .patch(`/admin/runners/${runnerId}`)
            .send({ gender: "U" })
            .set("Authorization", ADMIN_USER_ACCESS_TOKEN),

          // Patch a runner with an invalid birth year type
          request(app.getHttpServer())
            .patch(`/admin/runners/${runnerId}`)
            .send({ birthYear: "invalid" })
            .set("Authorization", ADMIN_USER_ACCESS_TOKEN),

          // Patch a runner with a too low birth year
          request(app.getHttpServer())
            .patch(`/admin/runners/${runnerId}`)
            .send({ birthYear: 1899 })
            .set("Authorization", ADMIN_USER_ACCESS_TOKEN),

          // Patch a runner with a too high birth year
          request(app.getHttpServer())
            .patch(`/admin/runners/${runnerId}`)
            .send({ birthYear: `${new Date().getFullYear() + 1}` })
            .set("Authorization", ADMIN_USER_ACCESS_TOKEN),

          // Patch a runner with an invalid stopped type
          request(app.getHttpServer())
            .patch(`/admin/runners/${runnerId}`)
            .send({ stopped: 123 })
            .set("Authorization", ADMIN_USER_ACCESS_TOKEN),

          // Patch a runner with an invalid race ID type
          request(app.getHttpServer())
            .patch(`/admin/runners/${runnerId}`)
            .send({ raceId: "invalid" })
            .set("Authorization", ADMIN_USER_ACCESS_TOKEN),

          // Patch a runner with a non-existing race ID
          request(app.getHttpServer())
            .patch(`/admin/runners/${runnerId}`)
            .send({ raceId: 123 })
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

      it("Test valid PATCH bodies", async () => {
        const values = [
          {
            patchValues: { firstname: "Edited firstname" },
            expectedValues: { firstname: "Edited firstname" },
          },
          {
            patchValues: { lastname: "Edited lastname" },
            expectedValues: { lastname: "Edited lastname" },
          },
          {
            patchValues: { gender: "F" },
            expectedValues: { gender: "F" },
          },
          {
            patchValues: { birthYear: 1971 },
            expectedValues: { birthYear: "1971" },
          },
          {
            patchValues: { birthYear: "1972" },
            expectedValues: { birthYear: "1972" },
          },
          {
            patchValues: { stopped: true },
            expectedValues: { stopped: true },
          },
          {
            patchValues: { raceId: 2 },
            expectedValues: { raceId: 2 },
          },
          {
            patchValues: {
              firstname: "Edited",
              lastname: "Again",
              gender: "M",
              birthYear: 1973,
              stopped: false,
              raceId: 3,
            },
            expectedValues: {
              firstname: "Edited",
              lastname: "Again",
              gender: "M",
              birthYear: "1973",
              stopped: false,
              raceId: 3,
            },
          },
        ];

        for (const { patchValues, expectedValues } of values) {
          const response = await request(app.getHttpServer())
            .patch(`/admin/runners/${runnerId}`)
            .send(patchValues)
            .set("Authorization", ADMIN_USER_ACCESS_TOKEN)
            .expect(HttpStatus.OK);

          const json = JSON.parse(response.text);

          expect(json.runner).toContainEntries(Object.entries(expectedValues));
        }
      });

      it("Try to edit runner with an already existing ID", async () => {
        const response = await request(app.getHttpServer())
          .patch(`/admin/runners/${runnersToPost[0].id}`)
          .send({ id: runnersToPost[1].id })
          .set("Authorization", ADMIN_USER_ACCESS_TOKEN)
          .expect(HttpStatus.BAD_REQUEST);

        expect(JSON.parse(response.text)).toEqual(badRequestBody(ERROR_MESSAGE_RUNNER_ID_ALREADY_EXISTS));
      });

      it("Edit runner with its own ID", async () => {
        const response = await request(app.getHttpServer())
          .patch(`/admin/runners/${runnersToPost[0].id}`)
          .send({ id: runnersToPost[0].id })
          .set("Authorization", ADMIN_USER_ACCESS_TOKEN)
          .expect(HttpStatus.OK);

        const json = JSON.parse(response.text);

        const runner = json.runner;

        expect(runner).toContainAllKeys(["id", "firstname", "lastname", "gender", "birthYear", "stopped", "raceId"]);

        expect(runner.id).toBe(runnersToPost[0].id);
      });

      describe("Edit runner ID without passages", async () => {
        it("Edit only ID", async () => {
          const response = await request(app.getHttpServer())
            .patch(`/admin/runners/${runnersToPost[0].id}`)
            .send({ id: runnerPatchId1 })
            .set("Authorization", ADMIN_USER_ACCESS_TOKEN)
            .expect(HttpStatus.OK);

          const json = JSON.parse(response.text);

          const runner = json.runner;

          expect(runner).toContainAllKeys(["id", "firstname", "lastname", "gender", "birthYear", "stopped", "raceId"]);

          expect(runner.id).toBe(runnerPatchId1);
        });

        it("Edit ID and firstname", async () => {
          const response = await request(app.getHttpServer())
            .patch(`/admin/runners/${runnerPatchId1}`)
            .send({
              id: runnerPatchId2,
              firstname: "Edited with ID",
            })
            .set("Authorization", ADMIN_USER_ACCESS_TOKEN)
            .expect(HttpStatus.OK);

          const json = JSON.parse(response.text);

          const runner = json.runner;

          expect(runner).toContainAllKeys(["id", "firstname", "lastname", "gender", "birthYear", "stopped", "raceId"]);

          expect(runner.id).toBe(runnerPatchId2);
          expect(runner.firstname).toBe("Edited with ID");
        });
      });

      describe("Edit runner ID with passages", async () => {
        it("Add a passage to a runner", async () => {
          await request(app.getHttpServer())
            .post(`/admin/runners/${runnerPatchId2}/passages`)
            .send({
              isHidden: false,
              time: "2024-04-06T08:00:00Z",
            })
            .set("Authorization", ADMIN_USER_ACCESS_TOKEN)
            .expect(HttpStatus.CREATED);
        });

        it("Edit only ID", async () => {
          const response = await request(app.getHttpServer())
            .patch(`/admin/runners/${runnerPatchId2}`)
            .send({ id: runnerPatchId3 })
            .set("Authorization", ADMIN_USER_ACCESS_TOKEN)
            .expect(HttpStatus.OK);

          const json = JSON.parse(response.text);

          const runner = json.runner;

          expect(runner).toContainAllKeys(["id", "firstname", "lastname", "gender", "birthYear", "stopped", "raceId"]);

          expect(runner.id).toBe(runnerPatchId3);
        });

        it("Edit ID and firstname", async () => {
          const response = await request(app.getHttpServer())
            .patch(`/admin/runners/${runnerPatchId3}`)
            .send({
              id: runnersToPost[0].id,
              firstname: "Edited with ID and passages",
            })
            .set("Authorization", ADMIN_USER_ACCESS_TOKEN)
            .expect(HttpStatus.OK);

          const json = JSON.parse(response.text);

          const runner = json.runner;

          expect(runner).toContainAllKeys(["id", "firstname", "lastname", "gender", "birthYear", "stopped", "raceId"]);

          expect(runner.id).toBe(runnersToPost[0].id);
          expect(runner.firstname).toBe("Edited with ID and passages");
        });
      });
    });

    describe("Delete a runner (DELETE /admin/runners/{id})", async () => {
      it("Try to delete non-existing runner", async () => {
        const response = await request(app.getHttpServer())
          .delete("/admin/runners/23456789")
          .set("Authorization", ADMIN_USER_ACCESS_TOKEN)
          .expect(HttpStatus.NOT_FOUND);

        expect(JSON.parse(response.text)).toEqual(notFoundBody(ERROR_MESSAGE_RUNNER_NOT_FOUND));
      });

      it("Try to delete a runner with invalid ID format", async () => {
        const response = await request(app.getHttpServer())
          .delete("/admin/runners/invalid")
          .set("Authorization", ADMIN_USER_ACCESS_TOKEN)
          .expect(HttpStatus.BAD_REQUEST);

        expect(JSON.parse(response.text)).toEqual(badRequestBody(ERROR_MESSAGE_RUNNER_ID_MUST_BE_NUMBER));
      });

      it("Delete runners", async () => {
        for (const runnerToDelete of runnersToPost) {
          const response = await request(app.getHttpServer())
            .delete(`/admin/runners/${runnerToDelete.id}`)
            .set("Authorization", ADMIN_USER_ACCESS_TOKEN)
            .expect(HttpStatus.NO_CONTENT);

          expect(response.text).toBeEmpty();
        }
      });

      it("Try to re-delete runners", async () => {
        for (const runnerToDelete of runnersToPost) {
          const response = await request(app.getHttpServer())
            .delete(`/admin/runners/${runnerToDelete.id}`)
            .set("Authorization", ADMIN_USER_ACCESS_TOKEN)
            .expect(HttpStatus.NOT_FOUND);

          expect(JSON.parse(response.text)).toEqual(notFoundBody(ERROR_MESSAGE_RUNNER_NOT_FOUND));
        }
      });
    });

    describe("Bulk import runners (POST /admin/runners-bulk)", async () => {
      it("Import runners", async () => {
        const response = await request(app.getHttpServer())
          .post("/admin/runners-bulk")
          .send(runnersToPost)
          .set("Authorization", ADMIN_USER_ACCESS_TOKEN)
          .expect(HttpStatus.CREATED);

        expect(JSON.parse(response.text)).toEqual({ count: 2 });
      });

      it("Delete runners", async () => {
        for (const runnerToDelete of runnersToPost) {
          const response = await request(app.getHttpServer())
            .delete(`/admin/runners/${runnerToDelete.id}`)
            .set("Authorization", ADMIN_USER_ACCESS_TOKEN)
            .expect(HttpStatus.NO_CONTENT);

          expect(response.text).toBeEmpty();
        }
      });
    });
  });
});
