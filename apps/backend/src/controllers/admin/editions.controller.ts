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
  Put,
  RawBodyRequest,
  Req,
  UseGuards,
} from "@nestjs/common";
import {
  ApiResponse,
  GetEditionAdminApiRequest,
  GetEditionsAdminApiRequest,
  PatchEditionAdminApiRequest,
  PostEditionAdminApiRequest,
} from "@live24hisere/core/types";
import { objectUtils } from "@live24hisere/utils";
import { EditionDto } from "../../dtos/edition/edition.dto";
import { UpdateEditionDto } from "../../dtos/edition/updateEdition.dto";
import { AuthGuard } from "../../guards/auth.guard";
import { EditionService } from "../../services/database/entities/edition.service";

@Controller()
@UseGuards(AuthGuard)
export class EditionsController {
  constructor(private readonly editionService: EditionService) {}

  @Get("/admin/editions")
  async getEditions(): Promise<ApiResponse<GetEditionsAdminApiRequest>> {
    const editions = await this.editionService.getAdminEditions();

    return {
      editions,
    };
  }

  @Post("/admin/editions")
  async createRace(@Body() editionDto: EditionDto): Promise<ApiResponse<PostEditionAdminApiRequest>> {
    await this.ensureEditionNameDoesNotExist(editionDto.name);

    const edition = await this.editionService.createEdition({
      ...objectUtils.instanceToObject(editionDto),
      order: (await this.editionService.getMaxOrder()) + 1,
    });

    return { edition };
  }

  @Get("/admin/editions/:editionId")
  async getEdition(@Param("editionId") editionId: string): Promise<ApiResponse<GetEditionAdminApiRequest>> {
    const id = Number(editionId);

    if (isNaN(id)) {
      throw new BadRequestException("Edition ID must be a number");
    }

    const edition = await this.editionService.getAdminEditionById(id);

    if (!edition) {
      throw new NotFoundException("Edition not found");
    }

    return {
      edition,
    };
  }

  @Patch("/admin/editions/:editionId")
  async updateEdition(
    @Param("editionId") editionId: string,
    @Body() updateEditionDto: UpdateEditionDto,
  ): Promise<ApiResponse<PatchEditionAdminApiRequest>> {
    const id = Number(editionId);

    if (isNaN(id)) {
      throw new BadRequestException("Edition ID must be a number");
    }

    const edition = await this.editionService.getAdminEditionById(id);

    if (!edition) {
      throw new NotFoundException("Edition not found");
    }

    if (updateEditionDto.name && edition.name !== updateEditionDto.name) {
      await this.ensureEditionNameDoesNotExist(updateEditionDto.name);
    }

    const updatedEdition = await this.editionService.updateEdition(id, updateEditionDto);

    return {
      edition: updatedEdition,
    };
  }

  @Delete("/admin/editions/:editionId")
  @HttpCode(204)
  async deleteEdition(@Param("editionId") editionId: string): Promise<void> {
    const id = Number(editionId);

    if (isNaN(id)) {
      throw new BadRequestException("Edition ID must be a number");
    }

    const edition = await this.editionService.getAdminEditionById(id);

    if (!edition) {
      throw new NotFoundException("Edition not found");
    }

    if (edition.raceCount > 0) {
      throw new BadRequestException("Cannot delete an edition if there are races in it");
    }

    await this.editionService.deleteEdition(id);
  }

  @Put("/admin/editions-order")
  @HttpCode(204)
  async updateRacesOrder(@Req() req: RawBodyRequest<Request>): Promise<void> {
    const body = req.body;

    if (!Array.isArray(body)) {
      throw new BadRequestException("Request body must be an array of edition ids");
    }

    let order = 0;

    const allEditions = await this.editionService.getAdminEditions();
    const touchedEditionIds = new Set<(typeof allEditions)[number]["id"]>();
    const updates: Array<Promise<unknown>> = [];

    // Update editions whose id has been passed in body
    for (const editionId of body) {
      if (typeof editionId !== "number") {
        continue;
      }

      const edition = allEditions.find((e) => e.id === editionId);

      if (!edition) {
        continue;
      }

      updates.push(this.editionService.updateEdition(editionId, { order }));
      order += 1;

      touchedEditionIds.add(editionId);
    }

    // Update other editions order to last provided race order + 1
    for (const edition of allEditions) {
      if (touchedEditionIds.has(edition.id)) {
        continue;
      }

      updates.push(this.editionService.updateEdition(edition.id, { order }));
    }

    await Promise.all(updates);
  }

  private async ensureEditionNameDoesNotExist(name: string): Promise<void> {
    const existingEdition = await this.editionService.getAdminEditionByName(name);

    if (existingEdition) {
      throw new BadRequestException("An edition with the same name already exists");
    }
  }
}
