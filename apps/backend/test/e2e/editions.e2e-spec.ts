import { HttpStatus, INestApplication } from "@nestjs/common";
import request from "supertest";
import { afterEach, beforeEach, describe, expect, it } from "vitest";
import { AdminEdition, PublicEdition } from "@live24hisere/core/types";
import { objectUtils } from "@live24hisere/utils";
import { initApp } from "./_init";
import { ADMIN_USER_ACCESS_TOKEN } from "./constants/accessToken";
import {
  ERROR_MESSAGE_CANNOT_DELETE_EDITION_WITH_RACES,
  ERROR_MESSAGE_EDITION_ID_MUST_BE_NUMBER,
  ERROR_MESSAGE_EDITION_NAME_ALREADY_EXISTS,
  ERROR_MESSAGE_EDITION_NOT_FOUND,
} from "./constants/errors";
import { badRequestBody, notFoundBody } from "./utils/errors";

describe("Edition endpoints (e2e)", { concurrent: false }, () => {
  let app: INestApplication;

  beforeEach(async () => {
    app = await initApp();
  });

  afterEach(async () => {
    await app.close();
  });

  describe("EditionsController (e2e)", () => {
    it("Get edition list (GET /editions)", async () => {
      const response = await request(app.getHttpServer()).get("/editions").expect(HttpStatus.OK);

      const json = JSON.parse(response.text);

      expect(json.editions).toBeArray();

      for (const edition of json.editions) {
        expect(edition).toContainAllKeys(["id", "name", "raceCount"]);

        expect(edition.id).toBeNumber();
        expect(edition.name).toBeString();
        expect(edition.raceCount).toBeNumber();
      }

      // Test editions order and test that private edition is not present
      expect(json.editions.map((edition: PublicEdition) => edition.id)).toEqual([7, 1, 2, 3, 4, 5, 6]);
    });
  });

  describe("Admin EditionsController (e2e)", () => {
    it("Get edition list (GET /admin/editions)", async () => {
      const response = await request(app.getHttpServer())
        .get("/admin/editions")
        .set("Authorization", ADMIN_USER_ACCESS_TOKEN)
        .expect(HttpStatus.OK);

      const json = JSON.parse(response.text);

      expect(json.editions).toBeArray();

      for (const edition of json.editions) {
        expect(edition).toContainAllKeys(["id", "name", "raceCount", "isPublic"]);

        expect(edition.id).toBeNumber();
        expect(edition.name).toBeString();
        expect(edition.raceCount).toBeNumber();
        expect(edition.isPublic).toBeBoolean();
      }

      // Test editions order and test that private edition is present
      expect(json.editions.map((edition: AdminEdition) => edition.id)).toEqual([7, 1, 2, 3, 4, 5, 6, 8]);
    });

    it("Get an edition (GET /admin/editions/{id})", async () => {
      const [publicResponse, nonPublicResponse, notFoundResponse, invalidIdResponse] = await Promise.all([
        // Get existing public edition
        request(app.getHttpServer())
          .get("/admin/editions/1")
          .set("Authorization", ADMIN_USER_ACCESS_TOKEN)
          .expect(HttpStatus.OK),

        // Get non-public edition
        request(app.getHttpServer())
          .get("/admin/editions/8")
          .set("Authorization", ADMIN_USER_ACCESS_TOKEN)
          .expect(HttpStatus.OK),

        // Get non-existing edition
        request(app.getHttpServer())
          .get("/admin/editions/10")
          .set("Authorization", ADMIN_USER_ACCESS_TOKEN)
          .expect(HttpStatus.NOT_FOUND),

        // Invalid ID format
        request(app.getHttpServer())
          .get("/admin/editions/invalid")
          .set("Authorization", ADMIN_USER_ACCESS_TOKEN)
          .expect(HttpStatus.BAD_REQUEST),
      ]);

      for (const response of [publicResponse, nonPublicResponse]) {
        const json = JSON.parse(response.text);

        const edition = json.edition;

        expect(edition).toBeObject();

        expect(edition).toContainAllKeys(["id", "name", "raceCount", "isPublic"]);

        expect(edition.id).toBeNumber();
        expect(edition.name).toBeString();
        expect(edition.raceCount).toBeNumber();
        expect(edition.isPublic).toBeBoolean();
      }

      const notFoundJson = JSON.parse(notFoundResponse.text);

      expect(notFoundJson).toEqual(notFoundBody(ERROR_MESSAGE_EDITION_NOT_FOUND));

      const invalidIdJson = JSON.parse(invalidIdResponse.text);

      expect(invalidIdJson).toEqual(badRequestBody(ERROR_MESSAGE_EDITION_ID_MUST_BE_NUMBER));
    });

    describe("Edit edition order (PUT /admin/editions-order)", async () => {
      it("Modify edition order with partial edition IDs", async () => {
        const response = await request(app.getHttpServer())
          .put("/admin/editions-order")
          .send([5, 2, 6, 1, 3])
          .set("Authorization", ADMIN_USER_ACCESS_TOKEN)
          .expect(HttpStatus.NO_CONTENT);

        expect(response.text).toBeEmpty();

        const editionListResponse = await request(app.getHttpServer())
          .get("/admin/editions")
          .set("Authorization", ADMIN_USER_ACCESS_TOKEN);

        const json = JSON.parse(editionListResponse.text);

        expect(json.editions).toBeArray();
        expect(json.editions.length).toBe(8);

        expect(json.editions.map((edition: AdminEdition) => edition.id).slice(0, 5)).toEqual([5, 2, 6, 1, 3]);
      });

      it("Modify edition order with all edition IDs", async () => {
        const response = await request(app.getHttpServer())
          .put("/admin/editions-order")
          .send([7, 1, 2, 3, 4, 5, 6, 8])
          .set("Authorization", ADMIN_USER_ACCESS_TOKEN)
          .expect(HttpStatus.NO_CONTENT);

        expect(response.text).toBeEmpty();

        const editionListResponse = await request(app.getHttpServer())
          .get("/admin/editions")
          .set("Authorization", ADMIN_USER_ACCESS_TOKEN);

        const json = JSON.parse(editionListResponse.text);

        expect(json.editions).toBeArray();

        expect(json.editions.map((edition: AdminEdition) => edition.id)).toEqual([7, 1, 2, 3, 4, 5, 6, 8]);
      });
    });

    const editionToPost: Omit<AdminEdition, "id"> = {
      name: "Test e2e edition",
      isPublic: true,
    };

    let createdEditionId: number;

    describe("Create an edition (POST /admin/editions)", async () => {
      it("Test invalid POST bodies", async () => {
        const responses = await Promise.all([
          // Post an edition without body
          request(app.getHttpServer()).post("/admin/editions").set("Authorization", ADMIN_USER_ACCESS_TOKEN),

          // Post an edition without name
          request(app.getHttpServer())
            .post("/admin/editions")
            .send(objectUtils.excludeKeys(editionToPost, ["name"]))
            .set("Authorization", ADMIN_USER_ACCESS_TOKEN),

          // Post an edition with an invalid name type
          request(app.getHttpServer())
            .post("/admin/editions")
            .send({ ...editionToPost, name: 4 })
            .set("Authorization", ADMIN_USER_ACCESS_TOKEN),

          // Post an edition with a too long name
          request(app.getHttpServer())
            .post("/admin/editions")
            .send({
              ...editionToPost,
              name: "51 characters 51 characters 51 characters 51 charac",
            })
            .set("Authorization", ADMIN_USER_ACCESS_TOKEN),

          // Post a race without isPublic
          request(app.getHttpServer())
            .post("/admin/editions")
            .send(objectUtils.excludeKeys(editionToPost, ["isPublic"]))
            .set("Authorization", ADMIN_USER_ACCESS_TOKEN),

          // Post a race with an invalid isPublic type
          request(app.getHttpServer())
            .post("/admin/editions")
            .send({
              ...editionToPost,
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
          .post("/admin/editions")
          .send(editionToPost)
          .set("Authorization", ADMIN_USER_ACCESS_TOKEN)
          .expect(HttpStatus.CREATED);

        const json = JSON.parse(response.text);

        const createdEdition = json.edition;

        expect(createdEdition).toContainAllKeys(["id", "name", "isPublic", "raceCount"]);

        createdEditionId = json.edition.id;

        expect(createdEdition.name).toBe(editionToPost.name);
        expect(createdEdition.isPublic).toBe(editionToPost.isPublic);
        expect(createdEdition.raceCount).toBe(0);
      });

      it("Try to post the same edition again", async () => {
        const response = await request(app.getHttpServer())
          .post("/admin/editions")
          .send(editionToPost)
          .set("Authorization", ADMIN_USER_ACCESS_TOKEN)
          .expect(HttpStatus.BAD_REQUEST);

        const json = JSON.parse(response.text);

        expect(json).toEqual(badRequestBody(ERROR_MESSAGE_EDITION_NAME_ALREADY_EXISTS));
      });

      it("Get race list, check order and test that the new edition is present", async () => {
        const response = await request(app.getHttpServer())
          .get("/admin/editions")
          .set("Authorization", ADMIN_USER_ACCESS_TOKEN);

        const json = JSON.parse(response.text);

        // Test editions order and test that the new edition is present
        expect(json.editions.map((edition: AdminEdition) => edition.id)).toEqual([
          7,
          1,
          2,
          3,
          4,
          5,
          6,
          8,
          createdEditionId,
        ]);
      });
    });

    describe("Edit an edition (PATCH /admin/editions/{id}", async () => {
      it("Test invalid PATCH bodies", async () => {
        const responses = await Promise.all([
          // Patch an edition with an invalid name type
          request(app.getHttpServer())
            .patch(`/admin/editions/${createdEditionId}`)
            .send({ name: 4 })
            .set("Authorization", ADMIN_USER_ACCESS_TOKEN),

          // Patch an edition with a too long name
          request(app.getHttpServer())
            .patch(`/admin/editions/${createdEditionId}`)
            .send({
              name: "51 characters 51 characters 51 characters 51 charac",
            })
            .set("Authorization", ADMIN_USER_ACCESS_TOKEN),

          // Patch an edition with an invalid isPublic type
          request(app.getHttpServer())
            .patch(`/admin/editions/${createdEditionId}`)
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

      it("Test valid PATCH bodies", async () => {
        const values = [
          {
            patchValues: { name: "Edited edition name" },
            expectedValues: { name: "Edited edition name" },
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
              isPublic: true,
            },
            expectedValues: {
              name: "Edited again",
              isPublic: true,
            },
          },
        ];

        for (const { patchValues, expectedValues } of values) {
          const response = await request(app.getHttpServer())
            .patch(`/admin/editions/${createdEditionId}`)
            .send(patchValues)
            .set("Authorization", ADMIN_USER_ACCESS_TOKEN)
            .expect(HttpStatus.OK);

          const json = JSON.parse(response.text);

          expect(json.edition).toContainEntries(Object.entries(expectedValues));
        }
      });
    });

    describe("Delete an edition (DELETE /admin/editions/{id}", async () => {
      it("Ensure that the edition cannot be deleted if it contains races", async () => {
        const response = await request(app.getHttpServer())
          .delete("/admin/editions/1")
          .set("Authorization", ADMIN_USER_ACCESS_TOKEN)
          .expect(HttpStatus.BAD_REQUEST);

        const json = JSON.parse(response.text);

        expect(json).toEqual(badRequestBody(ERROR_MESSAGE_CANNOT_DELETE_EDITION_WITH_RACES));
      });

      it("Delete edition", async () => {
        const response = await request(app.getHttpServer())
          .delete(`/admin/editions/${createdEditionId}`)
          .set("Authorization", ADMIN_USER_ACCESS_TOKEN)
          .expect(HttpStatus.NO_CONTENT);

        expect(response.text).toBeEmpty();
      });

      it("Try to delete the same edition again", async () => {
        const response = await request(app.getHttpServer())
          .delete(`/admin/editions/${createdEditionId}`)
          .set("Authorization", ADMIN_USER_ACCESS_TOKEN)
          .expect(HttpStatus.NOT_FOUND);

        const json = JSON.parse(response.text);

        expect(json).toEqual(notFoundBody(ERROR_MESSAGE_EDITION_NOT_FOUND));
      });
    });
  });
});
