import { Injectable } from "@nestjs/common";
import { eq } from "drizzle-orm";
import { PassageImportRule, PassageImportRuleWithRaceIds } from "@live24hisere/core/types";
import { TABLE_PASSAGE_IMPORT_RULE, TABLE_PASSAGE_IMPORT_RULE_RACE } from "../../../../drizzle/schema";
import { EntityService } from "../entity.service";

@Injectable()
export class PassageImportRuleService extends EntityService {
  async getRules(): Promise<PassageImportRuleWithRaceIds[]> {
    const rules = await this.db.select().from(TABLE_PASSAGE_IMPORT_RULE);

    const rulesWithRaceIds = await Promise.all(
      rules.map(async (rule) => ({
        ...rule,
        raceIds: (
          await this.db
            .select({ raceId: TABLE_PASSAGE_IMPORT_RULE_RACE.raceId })
            .from(TABLE_PASSAGE_IMPORT_RULE_RACE)
            .where(eq(TABLE_PASSAGE_IMPORT_RULE_RACE.ruleId, rule.id))
        ).map((res) => res.raceId),
      })),
    );

    return rulesWithRaceIds;
  }

  async getActiveRules(): Promise<PassageImportRule[]> {
    return await this.db.select().from(TABLE_PASSAGE_IMPORT_RULE).where(eq(TABLE_PASSAGE_IMPORT_RULE.isActive, true));
  }
}
