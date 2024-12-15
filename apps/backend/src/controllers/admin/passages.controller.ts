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
  Query,
  UseGuards,
} from "@nestjs/common";
import {
  ApiResponse,
  GetAllPassagesAdminApiRequest,
  PatchPassageAdminApiRequest,
  PostPassageAdminApiRequest,
} from "@live24hisere/core/types";
import { objectUtils, typeUtils } from "@live24hisere/utils";
import { PassageDto } from "../../dtos/passage/passage.dto";
import { UpdatePassageDto } from "../../dtos/passage/updatePassage.dto";
import { AuthGuard } from "../../guards/auth.guard";
import { ParticipantService } from "../../services/database/entities/participant.service";
import { PassageService } from "../../services/database/entities/passage.service";
import { QueryParam } from "../../types/utils/query";

@Controller()
@UseGuards(AuthGuard)
export class PassagesController {
  constructor(
    private readonly participantService: ParticipantService,
    private readonly passageService: PassageService,
  ) {}

  @Get("/admin/passages")
  async getPassages(
    @Query("excludeHidden") excludeHidden: QueryParam,
  ): Promise<ApiResponse<GetAllPassagesAdminApiRequest>> {
    const passages = typeUtils.isDefined(excludeHidden)
      ? await this.passageService.getAllPublicPassages()
      : await this.passageService.getAllPassages();

    return { passages };
  }

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
}
