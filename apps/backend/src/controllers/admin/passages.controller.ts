import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  NotFoundException,
  Param,
  Patch,
  Post,
  UseGuards,
} from "@nestjs/common";
import { PASSAGE_ORIGIN } from "@live24hisere/core/constants";
import {
  ApiResponse,
  GetAllPassagesOfRaceAdminApiRequest,
  PatchPassageAdminApiRequest,
  PostPassageAdminApiRequest,
} from "@live24hisere/core/types";
import { objectUtils } from "@live24hisere/utils";
import { PassageDto } from "../../dtos/passage/passage.dto";
import { UpdatePassageDto } from "../../dtos/passage/updatePassage.dto";
import { AuthGuard } from "../../guards/auth.guard";
import { ParticipantService } from "../../services/database/entities/participant.service";
import { PassageService } from "../../services/database/entities/passage.service";
import { RaceService } from "../../services/database/entities/race.service";

@Controller()
@UseGuards(AuthGuard)
export class PassagesController {
  constructor(
    private readonly participantService: ParticipantService,
    private readonly passageService: PassageService,
    private readonly raceService: RaceService,
  ) {}

  @Post("/admin/passages")
  async getRunnerPassages(@Body() passageDto: PassageDto): Promise<ApiResponse<PostPassageAdminApiRequest>> {
    const participant = await this.participantService.getAdminParticipantByRaceIdAndRunnerId(
      passageDto.raceId,
      passageDto.runnerId,
    );

    if (!participant) {
      throw new BadRequestException(
        `No participant found with race ID ${passageDto.raceId} and runner ID ${passageDto.runnerId}`,
      );
    }

    const passage = await this.passageService.createPassage(participant.id, {
      ...objectUtils.excludeKeys(passageDto, ["raceId", "runnerId"]),
      origin: PASSAGE_ORIGIN.MANUAL,
      detectionId: null,
      importTime: null,
    });

    return {
      passage: objectUtils.excludeKeys(passage, ["raceId", "runnerId"]),
    };
  }

  @Patch("/admin/passages/:passageId")
  async updateRunnerPassage(
    @Param("passageId") passageId: string,
    @Body() updatePassageDto: UpdatePassageDto,
  ): Promise<ApiResponse<PatchPassageAdminApiRequest>> {
    const id = Number(passageId);

    if (isNaN(id)) {
      throw new BadRequestException("PassageId must be a number");
    }

    const passage = await this.passageService.getPassageById(id);

    if (!passage) {
      throw new NotFoundException("Passage not found");
    }

    const updatedPassage = await this.passageService.updatePassage(id, updatePassageDto);

    return {
      passage: objectUtils.excludeKeys(updatedPassage, ["raceId", "runnerId"]),
    };
  }

  @Delete("/admin/passages/:passageId")
  @HttpCode(204)
  async deleteRunnerPassage(@Param("passageId") passageId: string): Promise<void> {
    const Id = Number(passageId);

    if (isNaN(Id)) {
      throw new BadRequestException("PassageId must be a number");
    }

    const passage = await this.passageService.getPassageById(Id);

    if (!passage) {
      throw new NotFoundException("Passage not found");
    }

    await this.passageService.deletePassage(Id);
  }

  @Get("/admin/races/:raceId/passages")
  async getRacePassages(@Param("raceId") raceId: string): Promise<ApiResponse<GetAllPassagesOfRaceAdminApiRequest>> {
    const id = Number(raceId);

    if (isNaN(id)) {
      throw new BadRequestException("Race ID must be a number");
    }

    const race = await this.raceService.getAdminRaceById(id);

    if (!race) {
      throw new NotFoundException("Race not found");
    }

    const passages = await this.passageService.getAllPassagesOfRace(race.id);

    return { passages };
  }
}
