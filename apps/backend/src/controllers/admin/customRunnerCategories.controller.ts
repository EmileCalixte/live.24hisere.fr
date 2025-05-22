import {
  BadRequestException,
  Body,
  Controller,
  NotFoundException,
  Param,
  Patch,
  Post,
  UseGuards,
} from "@nestjs/common";
import {
  ApiResponse,
  PatchCustomRunnerCategoryAdminApiRequest,
  PostCustomRunnerCategoryAdminApiRequest,
} from "@live24hisere/core/types";
import { CustomRunnerCategoryDto } from "../../dtos/customRunnerCategory/customRunnerCategory.dto";
import { UpdateCustomRunnerCategoryDto } from "../../dtos/customRunnerCategory/updateCustomRunnerCategory.dto";
import { AuthGuard } from "../../guards/auth.guard";
import { CustomRunnerCategoryService } from "../../services/database/entities/customRunnerCategory.service";

@Controller()
@UseGuards(AuthGuard)
export class CustomRunnerCategoriesController {
  constructor(private readonly customRunnerCategoryService: CustomRunnerCategoryService) {}

  @Post("/admin/custom-runner-categories")
  async createCategory(
    @Body() categoryDto: CustomRunnerCategoryDto,
  ): Promise<ApiResponse<PostCustomRunnerCategoryAdminApiRequest>> {
    await this.ensureCategoryCodeDoesNotExist(categoryDto.code);

    const category = await this.customRunnerCategoryService.createCategory(categoryDto);

    return {
      customRunnerCategory: category,
    };
  }

  @Patch("/admin/custom-runner-categories/:categoryId")
  async updateCategory(
    @Param("categoryId") categoryId: string,
    @Body() updateCategoryDto: UpdateCustomRunnerCategoryDto,
  ): Promise<ApiResponse<PatchCustomRunnerCategoryAdminApiRequest>> {
    const id = Number(categoryId);

    if (isNaN(id)) {
      throw new BadRequestException("Category ID must be a number");
    }

    const category = await this.customRunnerCategoryService.getCategoryById(id);

    if (!category) {
      throw new NotFoundException("Custom runner category not found");
    }

    const isCodeUpdated = updateCategoryDto.code !== undefined && category.code !== updateCategoryDto.code;

    if (isCodeUpdated) {
      await this.ensureCategoryCodeDoesNotExist(updateCategoryDto.code ?? category.code);
    }

    const updatedCategory = await this.customRunnerCategoryService.updateCategory(id, updateCategoryDto);

    return {
      customRunnerCategory: updatedCategory,
    };
  }

  private async ensureCategoryCodeDoesNotExist(code: string): Promise<void> {
    const existingCategory = await this.customRunnerCategoryService.getCategoryByCode(code);

    if (existingCategory) {
      throw new BadRequestException("A custom runner category with the same code already exists");
    }
  }
}
