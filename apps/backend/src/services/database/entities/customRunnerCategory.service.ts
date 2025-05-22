import { Injectable } from "@nestjs/common";
import { eq } from "drizzle-orm";
import { CustomRunnerCategory } from "@live24hisere/core/types";
import { objectUtils } from "@live24hisere/utils";
import { TABLE_CUSTOM_RUNNER_CATEGORY } from "../../../../drizzle/schema";
import { EntityService } from "../entity.service";

@Injectable()
export class CustomRunnerCategoryService extends EntityService {
  async getCategoryById(categoryId: number): Promise<CustomRunnerCategory | null> {
    const categories = await this.db
      .select()
      .from(TABLE_CUSTOM_RUNNER_CATEGORY)
      .where(eq(TABLE_CUSTOM_RUNNER_CATEGORY.id, categoryId));

    return this.getUniqueResult(categories);
  }

  async getCategoryByCode(categoryCode: string): Promise<CustomRunnerCategory | null> {
    const categories = await this.db
      .select()
      .from(TABLE_CUSTOM_RUNNER_CATEGORY)
      .where(eq(TABLE_CUSTOM_RUNNER_CATEGORY.code, categoryCode));

    return this.getUniqueResult(categories);
  }

  async createCategory(categoryData: Omit<CustomRunnerCategory, "id">): Promise<CustomRunnerCategory> {
    const result = await this.db.insert(TABLE_CUSTOM_RUNNER_CATEGORY).values(categoryData).$returningId();

    const categoryId = this.getUniqueResult(result)?.id;

    if (categoryId === undefined) {
      throw new Error("Failed to insert a custom runner category in database (no ID returned)");
    }

    const newCategory = await this.getCategoryById(categoryId);

    if (!newCategory) {
      throw new Error(
        `Failed to get create custom runner category data in database (created category ID: ${categoryId})`,
      );
    }

    return newCategory;
  }

  async updateCategory(
    categoryId: number,
    newCategoryData: Partial<Omit<CustomRunnerCategory, "id">>,
  ): Promise<CustomRunnerCategory> {
    if (!objectUtils.isEmptyObject(newCategoryData)) {
      const [resultSetHeader] = await this.db
        .update(TABLE_CUSTOM_RUNNER_CATEGORY)
        .set(newCategoryData)
        .where(eq(TABLE_CUSTOM_RUNNER_CATEGORY, categoryId));

      if (resultSetHeader.affectedRows === 0) {
        throw new Error(`Custom runner category ID ${categoryId} not found in database`);
      }
    }

    const newCategory = await this.getCategoryById(categoryId);

    if (!newCategory) {
      throw new Error(
        `Failed to get updated custom runner category data from database (updated category ID: ${categoryId})`,
      );
    }

    return newCategory;
  }
}
