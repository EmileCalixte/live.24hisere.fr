import { Injectable } from "@nestjs/common";
import { ValidationArguments, ValidatorConstraint, ValidatorConstraintInterface } from "class-validator";
import { CustomRunnerCategoryService } from "../../../services/database/entities/customRunnerCategory.service";

@Injectable()
@ValidatorConstraint({ name: "CustomRunnerCategoryExists", async: true })
export class CustomRunnerCategoryIdExistsRule implements ValidatorConstraintInterface {
  constructor(private readonly customRunnerCategoryService: CustomRunnerCategoryService) {}

  async validate(value: unknown): Promise<boolean> {
    if (typeof value !== "number") {
      return false;
    }

    const category = await this.customRunnerCategoryService.getCategoryById(value);

    return !!category;
  }

  defaultMessage(validationArguments?: ValidationArguments): string {
    return "No custom runner category with this ID exists";
  }
}
