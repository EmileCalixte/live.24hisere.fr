import { Injectable } from "@nestjs/common";
import { and, asc, eq, getTableColumns } from "drizzle-orm";
import { Participant } from "@live24hisere/core/types";
import { objectUtils } from "@live24hisere/utils";
import { TABLE_EDITION, TABLE_PARTICIPANT, TABLE_RACE } from "../../../../drizzle/schema";
import { EntityService } from "../entity.service";

@Injectable()
export class ParticipantService extends EntityService {
  async getAdminParticipantById(id: number): Promise<Participant | null> {
    const participants = await this.db.select().from(TABLE_PARTICIPANT).where(eq(TABLE_PARTICIPANT.id, id));

    return this.getUniqueResult(participants);
  }

  async getAdminParticipantByRaceIdAndRunnerId(raceId: number, runnerId: number): Promise<Participant | null> {
    const participants = await this.db
      .select()
      .from(TABLE_PARTICIPANT)
      .where(and(eq(TABLE_PARTICIPANT.raceId, raceId), eq(TABLE_PARTICIPANT.runnerId, runnerId)));

    return this.getUniqueResult(participants);
  }

  async getAdminParticipantByRaceIdAndBibNumber(raceId: number, bibNumber: number): Promise<Participant | null> {
    const participants = await this.db
      .select()
      .from(TABLE_PARTICIPANT)
      .where(and(eq(TABLE_PARTICIPANT.raceId, raceId), eq(TABLE_PARTICIPANT.bibNumber, bibNumber)));

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

  async createParticipant(participantData: Omit<Participant, "id">): Promise<Participant> {
    const result = await this.db.insert(TABLE_PARTICIPANT).values(participantData).$returningId();

    const participantId = this.getUniqueResult(result)?.id;

    if (participantId === undefined) {
      throw new Error("Failed to insert a participant in database (no ID returned)");
    }

    const newParticipant = await this.getAdminParticipantById(participantId);

    if (!newParticipant) {
      throw new Error(`Failed to get created participant data in database (created participant ID: ${participantId})`);
    }

    return newParticipant;
  }

  async updateParticipant(
    participantId: number,
    newParticipantData: Partial<Omit<Participant, "id">>,
  ): Promise<Participant> {
    if (!objectUtils.isEmptyObject(newParticipantData)) {
      const [resultSetHeader] = await this.db
        .update(TABLE_PARTICIPANT)
        .set(newParticipantData)
        .where(eq(TABLE_PARTICIPANT.id, participantId));

      if (resultSetHeader.affectedRows === 0) {
        throw new Error(`Participant with ID ${participantId} not found in database`);
      }
    }

    const newParticipant = await this.getAdminParticipantById(participantId);

    if (!newParticipant) {
      throw new Error(`Failed to get updated participant data from database (updated race ID: ${participantId})`);
    }

    return newParticipant;
  }
}
