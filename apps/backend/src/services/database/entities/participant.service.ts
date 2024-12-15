import { Injectable } from "@nestjs/common";
import { and, asc, eq, getTableColumns } from "drizzle-orm";
import { Participant } from "@live24hisere/core/types";
import { TABLE_EDITION, TABLE_PARTICIPANT, TABLE_RACE } from "../../../../drizzle/schema";
import { EntityService } from "../entity.service";

@Injectable()
export class ParticipantService extends EntityService {
  async getAdminParticipantByRaceIdAndRunnerId(raceId: number, runnerId: number): Promise<Participant | null> {
    const participants = await this.db
      .select()
      .from(TABLE_PARTICIPANT)
      .where(and(eq(TABLE_PARTICIPANT.raceId, raceId), eq(TABLE_PARTICIPANT.runnerId, runnerId)));

    return this.getUniqueResult(participants);
  }

  async getAdminParticipantsByRunnerId(runnerId: number): Promise<Participant[]> {
    return await this.db
      .select(getTableColumns(TABLE_PARTICIPANT))
      .from(TABLE_PARTICIPANT)
      .innerJoin(TABLE_RACE, eq(TABLE_RACE.id, TABLE_PARTICIPANT.raceId))
      .innerJoin(TABLE_EDITION, eq(TABLE_EDITION.id, TABLE_RACE.editionId))
      .where(eq(TABLE_PARTICIPANT.runnerId, runnerId))
      .orderBy(asc(TABLE_EDITION.order), asc(TABLE_RACE.order));
  }
}
