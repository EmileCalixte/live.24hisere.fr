import { Injectable } from "@nestjs/common";
import { eq } from "drizzle-orm";
import { PassageImportRule } from "@live24hisere/core/types";
import { TABLE_PASSAGE_IMPORT_RULE } from "../../../../drizzle/schema";
import { EntityService } from "../entity.service";

@Injectable()
export class PassageImportRuleService extends EntityService {
  async getActiveRules(): Promise<PassageImportRule[]> {
    return await this.db.select().from(TABLE_PASSAGE_IMPORT_RULE).where(eq(TABLE_PASSAGE_IMPORT_RULE.isActive, true));
  }
}
