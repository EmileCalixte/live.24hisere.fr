import { HttpStatus, INestApplication } from "@nestjs/common";
import request from "supertest";
import { afterEach, beforeAll, beforeEach, describe, expect, it } from "vitest";
import {
  CustomRunnerCategory,
  CustomRunnerCategoryWithRunnerCount,
  CustomRunnerCategoryWithRunners,
} from "@live24hisere/core/types";
import { initApp } from "./_init";
import { ADMIN_USER_ACCESS_TOKEN } from "./constants/accessToken";
import {
  ERROR_MESSAGE_CUSTOM_RUNNER_CATEGORY_CANNOT_DELETE_WITH_RUNNERS,
  ERROR_MESSAGE_CUSTOM_RUNNER_CATEGORY_CODE_ALREADY_EXISTS,
  ERROR_MESSAGE_CUSTOM_RUNNER_CATEGORY_ID_MUST_BE_NUMBER,
  ERROR_MESSAGE_CUSTOM_RUNNER_CATEGORY_NOT_FOUND,
} from "./constants/errors";
import { badRequestBody, notFoundBody } from "./utils/errors";
import { responseAtIndex } from "./utils/misc";

// Participant used to test assignment (race 4, runner 21 from test DB)
const TEST_RACE_ID = 4;
const TEST_RUNNER_ID = 21;

describe("Custom runner category endpoints (e2e)", { concurrent: false }, () => {
  let app: INestApplication;

  beforeEach(async () => {
    app = await initApp();
  });

  afterEach(async () => {
    await app.close();
  });

  describe("Admin CustomRunnerCategoriesController (e2e)", () => {
    const categoryToPost = { code: "TST", name: "Test category" };

    let createdCategoryId: number;

    beforeAll(async () => {
      const app = await initApp();

      // Unassign the test runner from any custom category (cleanup from previous run)
      await request(app.getHttpServer())
        .patch(`/admin/races/${TEST_RACE_ID}/runners/${TEST_RUNNER_ID}`)
        .send({ customCategoryId: null })
        .set("Authorization", ADMIN_USER_ACCESS_TOKEN);

      // Delete any leftover test categories
      const listResponse = await request(app.getHttpServer())
        .get("/admin/custom-runner-categories")
        .set("Authorization", ADMIN_USER_ACCESS_TOKEN);

      const categories: Array<{ id: number; code: string }> =
        JSON.parse(listResponse.text).customRunnerCategories ?? [];

      for (const category of categories.filter((c) => ["TST", "TST2", "TST3"].includes(c.code))) {
        await request(app.getHttpServer())
          .delete(`/admin/custom-runner-categories/${category.id}`)
          .set("Authorization", ADMIN_USER_ACCESS_TOKEN);
      }

      await app.close();
    });

    describe("Create a custom runner category (POST /admin/custom-runner-categories)", () => {
      it("Test invalid POST bodies", async () => {
        const responses = await Promise.all([
          // Without body
          request(app.getHttpServer())
            .post("/admin/custom-runner-categories")
            .set("Authorization", ADMIN_USER_ACCESS_TOKEN),

          // Without code
          request(app.getHttpServer())
            .post("/admin/custom-runner-categories")
            .send({ name: categoryToPost.name })
            .set("Authorization", ADMIN_USER_ACCESS_TOKEN),

          // Code too long (max 4 chars)
          request(app.getHttpServer())
            .post("/admin/custom-runner-categories")
            .send({ ...categoryToPost, code: "TOOLONG" })
            .set("Authorization", ADMIN_USER_ACCESS_TOKEN),

          // Without name
          request(app.getHttpServer())
            .post("/admin/custom-runner-categories")
            .send({ code: categoryToPost.code })
            .set("Authorization", ADMIN_USER_ACCESS_TOKEN),

          // Name too long (max 50 chars)
          request(app.getHttpServer())
            .post("/admin/custom-runner-categories")
            .send({ ...categoryToPost, name: "This name is way too long and exceeds the fifty char" })
            .set("Authorization", ADMIN_USER_ACCESS_TOKEN),
        ]);

        for (const [index, response] of responses.entries()) {
          expect(response.statusCode, responseAtIndex(index)).toBe(HttpStatus.UNPROCESSABLE_ENTITY);
        }
      });

      it("Test valid POST body", async () => {
        const response = await request(app.getHttpServer())
          .post("/admin/custom-runner-categories")
          .send(categoryToPost)
          .set("Authorization", ADMIN_USER_ACCESS_TOKEN)
          .expect(HttpStatus.CREATED);

        const json = JSON.parse(response.text);
        const category: CustomRunnerCategory = json.customRunnerCategory;

        expect(category).toContainAllKeys(["id", "code", "name", "runnerCount"]);
        expect(category.id).toBeNumber();
        expect(category.code).toBe(categoryToPost.code);
        expect(category.name).toBe(categoryToPost.name);

        createdCategoryId = category.id;
      });

      it("Try to post a category with the same code", async () => {
        const response = await request(app.getHttpServer())
          .post("/admin/custom-runner-categories")
          .send(categoryToPost)
          .set("Authorization", ADMIN_USER_ACCESS_TOKEN)
          .expect(HttpStatus.BAD_REQUEST);

        expect(JSON.parse(response.text)).toEqual(
          badRequestBody(ERROR_MESSAGE_CUSTOM_RUNNER_CATEGORY_CODE_ALREADY_EXISTS),
        );
      });
    });

    it("Get category list and check the created category is present (GET /admin/custom-runner-categories)", async () => {
      const response = await request(app.getHttpServer())
        .get("/admin/custom-runner-categories")
        .set("Authorization", ADMIN_USER_ACCESS_TOKEN)
        .expect(HttpStatus.OK);

      const json = JSON.parse(response.text);

      expect(json.customRunnerCategories).toBeArray();

      for (const category of json.customRunnerCategories as CustomRunnerCategoryWithRunnerCount[]) {
        expect(category).toContainAllKeys(["id", "code", "name", "runnerCount"]);
        expect(category.id).toBeNumber();
        expect(category.code).toBeString();
        expect(category.name).toBeString();
        expect(category.runnerCount).toBeNumber();
      }

      expect(json.customRunnerCategories.map((c: CustomRunnerCategoryWithRunnerCount) => c.id)).toContain(
        createdCategoryId,
      );
    });

    it("Check that the created category is present in app data (GET /app-data)", async () => {
      const response = await request(app.getHttpServer()).get("/app-data").expect(HttpStatus.OK);

      const json = JSON.parse(response.text);

      expect(json.customRunnerCategories).toBeArray();
      expect(json.customRunnerCategories.map((c: CustomRunnerCategory) => c.id)).toContain(createdCategoryId);
    });

    it("Get a category by ID (GET /admin/custom-runner-categories/:categoryId)", async () => {
      const [validResponse, notFoundResponse, invalidIdResponse] = await Promise.all([
        request(app.getHttpServer())
          .get(`/admin/custom-runner-categories/${createdCategoryId}`)
          .set("Authorization", ADMIN_USER_ACCESS_TOKEN)
          .expect(HttpStatus.OK),

        request(app.getHttpServer())
          .get("/admin/custom-runner-categories/99999")
          .set("Authorization", ADMIN_USER_ACCESS_TOKEN)
          .expect(HttpStatus.NOT_FOUND),

        request(app.getHttpServer())
          .get("/admin/custom-runner-categories/invalid")
          .set("Authorization", ADMIN_USER_ACCESS_TOKEN)
          .expect(HttpStatus.BAD_REQUEST),
      ]);

      const validJson = JSON.parse(validResponse.text);
      const category: CustomRunnerCategoryWithRunners = validJson.customRunnerCategory;

      expect(category).toContainAllKeys(["id", "code", "name", "runnerCount", "runners"]);
      expect(category.id).toBe(createdCategoryId);
      expect(category.code).toBe(categoryToPost.code);
      expect(category.name).toBe(categoryToPost.name);
      expect(category.runners).toBeArray();

      expect(JSON.parse(notFoundResponse.text)).toEqual(notFoundBody(ERROR_MESSAGE_CUSTOM_RUNNER_CATEGORY_NOT_FOUND));
      expect(JSON.parse(invalidIdResponse.text)).toEqual(
        badRequestBody(ERROR_MESSAGE_CUSTOM_RUNNER_CATEGORY_ID_MUST_BE_NUMBER),
      );
    });

    describe("Update a custom runner category (PATCH /admin/custom-runner-categories/:categoryId)", () => {
      it("Update name", async () => {
        const response = await request(app.getHttpServer())
          .patch(`/admin/custom-runner-categories/${createdCategoryId}`)
          .send({ name: "Updated category name" })
          .set("Authorization", ADMIN_USER_ACCESS_TOKEN)
          .expect(HttpStatus.OK);

        const json = JSON.parse(response.text);

        expect(json.customRunnerCategory.name).toBe("Updated category name");
        expect(json.customRunnerCategory.code).toBe(categoryToPost.code);
      });

      it("Update code", async () => {
        const response = await request(app.getHttpServer())
          .patch(`/admin/custom-runner-categories/${createdCategoryId}`)
          .send({ code: "TST2" })
          .set("Authorization", ADMIN_USER_ACCESS_TOKEN)
          .expect(HttpStatus.OK);

        const json = JSON.parse(response.text);

        expect(json.customRunnerCategory.code).toBe("TST2");
      });

      it("Try to update with an already existing code", async () => {
        // First create a second category to have a conflicting code
        const tempCategoryResponse = await request(app.getHttpServer())
          .post("/admin/custom-runner-categories")
          .send({ code: "TST3", name: "Another test category" })
          .set("Authorization", ADMIN_USER_ACCESS_TOKEN)
          .expect(HttpStatus.CREATED);

        const tempJson = JSON.parse(tempCategoryResponse.text);
        const tempCategory: CustomRunnerCategory = tempJson.customRunnerCategory;

        const response = await request(app.getHttpServer())
          .patch(`/admin/custom-runner-categories/${createdCategoryId}`)
          .send({ code: "TST3" })
          .set("Authorization", ADMIN_USER_ACCESS_TOKEN)
          .expect(HttpStatus.BAD_REQUEST);

        expect(JSON.parse(response.text)).toEqual(
          badRequestBody(ERROR_MESSAGE_CUSTOM_RUNNER_CATEGORY_CODE_ALREADY_EXISTS),
        );

        // Clean up the second category
        await request(app.getHttpServer())
          .delete(`/admin/custom-runner-categories/${tempCategory.id}`)
          .set("Authorization", ADMIN_USER_ACCESS_TOKEN);
      });

      it("Try to update a non-existing category", async () => {
        const response = await request(app.getHttpServer())
          .patch("/admin/custom-runner-categories/99999")
          .send({ name: "Updated name" })
          .set("Authorization", ADMIN_USER_ACCESS_TOKEN)
          .expect(HttpStatus.NOT_FOUND);

        expect(JSON.parse(response.text)).toEqual(notFoundBody(ERROR_MESSAGE_CUSTOM_RUNNER_CATEGORY_NOT_FOUND));
      });
    });

    describe("Delete a custom runner category (DELETE /admin/custom-runner-categories/:categoryId)", () => {
      it("Try to delete a category with assigned runners", async () => {
        // Assign the category to a participant
        await request(app.getHttpServer())
          .patch(`/admin/races/${TEST_RACE_ID}/runners/${TEST_RUNNER_ID}`)
          .send({ customCategoryId: createdCategoryId })
          .set("Authorization", ADMIN_USER_ACCESS_TOKEN)
          .expect(HttpStatus.OK);

        const response = await request(app.getHttpServer())
          .delete(`/admin/custom-runner-categories/${createdCategoryId}`)
          .set("Authorization", ADMIN_USER_ACCESS_TOKEN)
          .expect(HttpStatus.BAD_REQUEST);

        expect(JSON.parse(response.text)).toEqual(
          badRequestBody(ERROR_MESSAGE_CUSTOM_RUNNER_CATEGORY_CANNOT_DELETE_WITH_RUNNERS),
        );

        // Unassign the category
        await request(app.getHttpServer())
          .patch(`/admin/races/${TEST_RACE_ID}/runners/${TEST_RUNNER_ID}`)
          .send({ customCategoryId: null })
          .set("Authorization", ADMIN_USER_ACCESS_TOKEN)
          .expect(HttpStatus.OK);
      });

      it("Check the runner appears in the category's runner list when assigned (GET /admin/custom-runner-categories/:categoryId)", async () => {
        // Assign the category
        await request(app.getHttpServer())
          .patch(`/admin/races/${TEST_RACE_ID}/runners/${TEST_RUNNER_ID}`)
          .send({ customCategoryId: createdCategoryId })
          .set("Authorization", ADMIN_USER_ACCESS_TOKEN)
          .expect(HttpStatus.OK);

        const response = await request(app.getHttpServer())
          .get(`/admin/custom-runner-categories/${createdCategoryId}`)
          .set("Authorization", ADMIN_USER_ACCESS_TOKEN)
          .expect(HttpStatus.OK);

        const json = JSON.parse(response.text);

        expect(json.customRunnerCategory.runners).toBeArray();
        expect(json.customRunnerCategory.runners.length).toBeGreaterThan(0);
        expect(json.customRunnerCategory.runners.map((r: { id: number }) => r.id)).toContain(TEST_RUNNER_ID);

        // Unassign the category
        await request(app.getHttpServer())
          .patch(`/admin/races/${TEST_RACE_ID}/runners/${TEST_RUNNER_ID}`)
          .send({ customCategoryId: null })
          .set("Authorization", ADMIN_USER_ACCESS_TOKEN)
          .expect(HttpStatus.OK);
      });

      it("Delete category", async () => {
        const response = await request(app.getHttpServer())
          .delete(`/admin/custom-runner-categories/${createdCategoryId}`)
          .set("Authorization", ADMIN_USER_ACCESS_TOKEN)
          .expect(HttpStatus.NO_CONTENT);

        expect(response.text).toBeEmpty();
      });

      it("Try to delete the same category again", async () => {
        const response = await request(app.getHttpServer())
          .delete(`/admin/custom-runner-categories/${createdCategoryId}`)
          .set("Authorization", ADMIN_USER_ACCESS_TOKEN)
          .expect(HttpStatus.NOT_FOUND);

        expect(JSON.parse(response.text)).toEqual(notFoundBody(ERROR_MESSAGE_CUSTOM_RUNNER_CATEGORY_NOT_FOUND));
      });
    });
  });
});
