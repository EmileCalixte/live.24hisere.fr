import { HttpStatus, INestApplication } from "@nestjs/common";
import request from "supertest";
import { afterEach, beforeEach, describe, expect, it } from "vitest";
import { PassageImportRuleWithRaceIds } from "@live24hisere/core/types";
import { initApp } from "./_init";
import { ADMIN_USER_ACCESS_TOKEN } from "./constants/accessToken";
import {
  ERROR_MESSAGE_PASSAGE_IMPORT_RULE_ID_MUST_BE_NUMBER,
  ERROR_MESSAGE_PASSAGE_IMPORT_RULE_NOT_FOUND,
  ERROR_MESSAGE_PASSAGE_IMPORT_RULE_RACE_IDS_MUST_EXIST,
} from "./constants/errors";
import { badRequestBody, notFoundBody } from "./utils/errors";
import { responseAtIndex } from "./utils/misc";

describe("Passage import rule endpoints (e2e)", { concurrent: false }, () => {
  let app: INestApplication;

  beforeEach(async () => {
    app = await initApp();
  });

  afterEach(async () => {
    await app.close();
  });

  describe("Admin PassageImportRulesController (e2e)", () => {
    const ruleToPost = { url: "http://passage-import.test/dag-file.xml", isActive: true };

    let createdRuleId: number;

    describe("Create a passage import rule (POST /admin/passage-import-rules)", () => {
      it("Test invalid POST bodies", async () => {
        const responses = await Promise.all([
          // Without body
          request(app.getHttpServer())
            .post("/admin/passage-import-rules")
            .set("Authorization", ADMIN_USER_ACCESS_TOKEN),

          // Without url
          request(app.getHttpServer())
            .post("/admin/passage-import-rules")
            .send({ isActive: true })
            .set("Authorization", ADMIN_USER_ACCESS_TOKEN),

          // Invalid url (not a URL)
          request(app.getHttpServer())
            .post("/admin/passage-import-rules")
            .send({ url: "not a valid url", isActive: true })
            .set("Authorization", ADMIN_USER_ACCESS_TOKEN),

          // Without isActive
          request(app.getHttpServer())
            .post("/admin/passage-import-rules")
            .send({ url: ruleToPost.url })
            .set("Authorization", ADMIN_USER_ACCESS_TOKEN),

          // Invalid isActive type
          request(app.getHttpServer())
            .post("/admin/passage-import-rules")
            .send({ ...ruleToPost, isActive: 1 })
            .set("Authorization", ADMIN_USER_ACCESS_TOKEN),
        ]);

        for (const [index, response] of responses.entries()) {
          expect(response.statusCode, responseAtIndex(index)).toBe(HttpStatus.UNPROCESSABLE_ENTITY);
        }
      });

      it("Test valid POST body", async () => {
        const response = await request(app.getHttpServer())
          .post("/admin/passage-import-rules")
          .send(ruleToPost)
          .set("Authorization", ADMIN_USER_ACCESS_TOKEN)
          .expect(HttpStatus.CREATED);

        const json = JSON.parse(response.text);
        const rule: PassageImportRuleWithRaceIds = json.rule;

        expect(rule).toContainAllKeys(["id", "url", "isActive", "raceIds"]);
        expect(rule.id).toBeNumber();
        expect(rule.url).toBe(ruleToPost.url);
        expect(rule.isActive).toBe(ruleToPost.isActive);
        expect(rule.raceIds).toEqual([]);

        createdRuleId = rule.id;
      });

      it("Get rule list and check the created rule is present", async () => {
        const response = await request(app.getHttpServer())
          .get("/admin/passage-import-rules")
          .set("Authorization", ADMIN_USER_ACCESS_TOKEN)
          .expect(HttpStatus.OK);

        const json = JSON.parse(response.text);

        expect(json.rules).toBeArray();
        expect(json.rules.map((r: PassageImportRuleWithRaceIds) => r.id)).toContain(createdRuleId);
      });
    });

    it("Get passage import rule by ID (GET /admin/passage-import-rules/:ruleId)", async () => {
      const [validResponse, notFoundResponse, invalidIdResponse] = await Promise.all([
        request(app.getHttpServer())
          .get(`/admin/passage-import-rules/${createdRuleId}`)
          .set("Authorization", ADMIN_USER_ACCESS_TOKEN)
          .expect(HttpStatus.OK),

        request(app.getHttpServer())
          .get("/admin/passage-import-rules/99999")
          .set("Authorization", ADMIN_USER_ACCESS_TOKEN)
          .expect(HttpStatus.NOT_FOUND),

        request(app.getHttpServer())
          .get("/admin/passage-import-rules/invalid")
          .set("Authorization", ADMIN_USER_ACCESS_TOKEN)
          .expect(HttpStatus.BAD_REQUEST),
      ]);

      const validJson = JSON.parse(validResponse.text);
      expect(validJson.rule).toContainAllKeys(["id", "url", "isActive", "raceIds"]);
      expect(validJson.rule.id).toBe(createdRuleId);

      expect(JSON.parse(notFoundResponse.text)).toEqual(notFoundBody(ERROR_MESSAGE_PASSAGE_IMPORT_RULE_NOT_FOUND));
      expect(JSON.parse(invalidIdResponse.text)).toEqual(
        badRequestBody(ERROR_MESSAGE_PASSAGE_IMPORT_RULE_ID_MUST_BE_NUMBER),
      );
    });

    describe("Update a passage import rule (PATCH /admin/passage-import-rules/:ruleId)", () => {
      it("Update url", async () => {
        const newUrl = "http://passage-import.test/updated-dag-file.xml";

        const response = await request(app.getHttpServer())
          .patch(`/admin/passage-import-rules/${createdRuleId}`)
          .send({ url: newUrl })
          .set("Authorization", ADMIN_USER_ACCESS_TOKEN)
          .expect(HttpStatus.OK);

        const json = JSON.parse(response.text);

        expect(json.rule.url).toBe(newUrl);
        expect(json.rule.isActive).toBe(ruleToPost.isActive);
      });

      it("Update isActive", async () => {
        const response = await request(app.getHttpServer())
          .patch(`/admin/passage-import-rules/${createdRuleId}`)
          .send({ isActive: false })
          .set("Authorization", ADMIN_USER_ACCESS_TOKEN)
          .expect(HttpStatus.OK);

        const json = JSON.parse(response.text);

        expect(json.rule.isActive).toBe(false);
      });

      it("Update raceIds with valid race IDs", async () => {
        const response = await request(app.getHttpServer())
          .patch(`/admin/passage-import-rules/${createdRuleId}`)
          .send({ raceIds: [1] })
          .set("Authorization", ADMIN_USER_ACCESS_TOKEN)
          .expect(HttpStatus.OK);

        const json = JSON.parse(response.text);

        expect(json.rule.raceIds).toEqual([1]);
      });

      it("Update raceIds with non-existent race IDs", async () => {
        const response = await request(app.getHttpServer())
          .patch(`/admin/passage-import-rules/${createdRuleId}`)
          .send({ raceIds: [99999] })
          .set("Authorization", ADMIN_USER_ACCESS_TOKEN)
          .expect(HttpStatus.BAD_REQUEST);

        expect(JSON.parse(response.text)).toEqual(
          badRequestBody(ERROR_MESSAGE_PASSAGE_IMPORT_RULE_RACE_IDS_MUST_EXIST),
        );
      });
    });

    describe("Delete a passage import rule (DELETE /admin/passage-import-rules/:ruleId)", () => {
      it("Delete rule", async () => {
        const response = await request(app.getHttpServer())
          .delete(`/admin/passage-import-rules/${createdRuleId}`)
          .set("Authorization", ADMIN_USER_ACCESS_TOKEN)
          .expect(HttpStatus.NO_CONTENT);

        expect(response.text).toBeEmpty();
      });

      it("Try to delete the same rule again", async () => {
        const response = await request(app.getHttpServer())
          .delete(`/admin/passage-import-rules/${createdRuleId}`)
          .set("Authorization", ADMIN_USER_ACCESS_TOKEN)
          .expect(HttpStatus.NOT_FOUND);

        expect(JSON.parse(response.text)).toEqual(notFoundBody(ERROR_MESSAGE_PASSAGE_IMPORT_RULE_NOT_FOUND));
      });
    });
  });
});
