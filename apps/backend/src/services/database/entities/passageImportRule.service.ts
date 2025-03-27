import { Injectable } from "@nestjs/common";
import { and, eq, sql } from "drizzle-orm";
import { PassageImportRule, PassageImportRuleWithRaceIds } from "@live24hisere/core/types";
import { objectUtils } from "@live24hisere/utils";
import { TABLE_PASSAGE, TABLE_PASSAGE_IMPORT_RULE, TABLE_PASSAGE_IMPORT_RULE_RACE } from "../../../../drizzle/schema";
import { Transaction } from "../drizzle.service";
import { EntityService } from "../entity.service";

@Injectable()
export class PassageImportRuleService extends EntityService {
  async getRules(): Promise<PassageImportRuleWithRaceIds[]> {
    const rules = await this.db.select().from(TABLE_PASSAGE_IMPORT_RULE);

    const rulesWithRaceIds = await Promise.all(
      rules.map(async (rule) => ({
        ...rule,
        raceIds: await this.getRuleRaceIds(rule.id),
      })),
    );

    return rulesWithRaceIds;
  }

  async getActiveRules(): Promise<PassageImportRule[]> {
    return await this.db.select().from(TABLE_PASSAGE_IMPORT_RULE).where(eq(TABLE_PASSAGE_IMPORT_RULE.isActive, true));
  }

  async getRuleWithRaceIdsById(ruleId: number): Promise<PassageImportRuleWithRaceIds | null> {
    const rules = await this.db
      .select()
      .from(TABLE_PASSAGE_IMPORT_RULE)
      .where(eq(TABLE_PASSAGE_IMPORT_RULE.id, ruleId));

    const rule = this.getUniqueResult(rules);

    if (!rule) {
      return null;
    }

    return {
      ...rule,
      raceIds: await this.getRuleRaceIds(rule.id),
    };
  }

  async getRuleById(ruleId: number): Promise<PassageImportRule | null> {
    const rules = await this.db
      .select()
      .from(TABLE_PASSAGE_IMPORT_RULE)
      .where(eq(TABLE_PASSAGE_IMPORT_RULE.id, ruleId));

    return this.getUniqueResult(rules);
  }

  async createRule(ruleData: Omit<PassageImportRule, "id">): Promise<PassageImportRuleWithRaceIds> {
    const result = await this.db.insert(TABLE_PASSAGE_IMPORT_RULE).values(ruleData).$returningId();

    const ruleId = this.getUniqueResult(result)?.id;

    if (ruleId === undefined) {
      throw new Error("Failed to insert a passage import rule in database (no ID returned)");
    }

    const newRule = await this.getRuleWithRaceIdsById(ruleId);

    if (!newRule) {
      throw new Error(`Failed to get created passage import rule data in database (created rule ID: ${ruleId})`);
    }

    return newRule;
  }

  async updateRule(
    ruleId: number,
    newRuleData: Partial<Omit<PassageImportRuleWithRaceIds, "id">>,
  ): Promise<PassageImportRuleWithRaceIds> {
    return await this.db.transaction(async (tx) => {
      const ruleDataToSave = objectUtils.excludeKeys(newRuleData, ["raceIds"]);

      if (Object.keys(ruleDataToSave).length > 0) {
        const [resultSetHeader] = await this.db
          .update(TABLE_PASSAGE_IMPORT_RULE)
          .set(ruleDataToSave)
          .where(eq(TABLE_PASSAGE_IMPORT_RULE.id, ruleId));

        if (resultSetHeader.affectedRows === 0) {
          throw new Error(`Passage import rule with ID ${ruleId} not found in database`);
        }
      }

      if (newRuleData.raceIds) {
        const newRaceIds = new Set(newRuleData.raceIds);
        const currentRaceIds = new Set(await this.getRuleRaceIds(ruleId));

        const raceIdsToDelete = Array.from(currentRaceIds).filter((raceId) => !newRaceIds.has(raceId));
        const raceIdsToAdd = Array.from(newRaceIds).filter((raceId) => !currentRaceIds.has(raceId));

        if (raceIdsToDelete.length > 0) {
          await tx
            .delete(TABLE_PASSAGE_IMPORT_RULE_RACE)
            .where(
              and(
                eq(TABLE_PASSAGE_IMPORT_RULE_RACE.ruleId, ruleId),
                sql`${TABLE_PASSAGE_IMPORT_RULE_RACE.raceId} IN ${raceIdsToDelete}`,
              ),
            );
        }

        if (raceIdsToAdd.length > 0) {
          await tx.insert(TABLE_PASSAGE_IMPORT_RULE_RACE).values(raceIdsToAdd.map((raceId) => ({ ruleId, raceId })));
        }
      }

      const newRule = this.getUniqueResult(
        await tx.select().from(TABLE_PASSAGE_IMPORT_RULE).where(eq(TABLE_PASSAGE_IMPORT_RULE.id, ruleId)),
      );

      if (!newRule) {
        throw new Error("Unable to retrieve new date of passage import rule after updating it");
      }

      return {
        ...newRule,
        raceIds: await this.getRuleRaceIds(newRule.id, tx),
      };
    });
  }

  /**
   * Deletes a passage import rule
   * @param ruleId The ID of the rule to delete
   * @returns true if the rule was found and deleted, false otherwise
   */
  async deleteRule(ruleId: number): Promise<boolean> {
    return await this.db.transaction(async (tx) => {
      await tx.delete(TABLE_PASSAGE_IMPORT_RULE_RACE).where(eq(TABLE_PASSAGE_IMPORT_RULE_RACE.ruleId, ruleId));

      await tx.update(TABLE_PASSAGE).set({ importRuleId: null }).where(eq(TABLE_PASSAGE.importRuleId, ruleId));

      const [resultSetHeader] = await tx
        .delete(TABLE_PASSAGE_IMPORT_RULE)
        .where(eq(TABLE_PASSAGE_IMPORT_RULE.id, ruleId));

      return !!resultSetHeader.affectedRows;
    });
  }

  private async getRuleRaceIds(ruleId: number, tx?: Transaction): Promise<number[]> {
    const db = tx ?? this.db;

    return (
      await db
        .select({ raceId: TABLE_PASSAGE_IMPORT_RULE_RACE.raceId })
        .from(TABLE_PASSAGE_IMPORT_RULE_RACE)
        .where(eq(TABLE_PASSAGE_IMPORT_RULE_RACE.ruleId, ruleId))
    ).map((res) => res.raceId);
  }
}
