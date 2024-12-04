import { Injectable } from "@nestjs/common";
import { ValidationArguments, ValidatorConstraint, ValidatorConstraintInterface } from "class-validator";
import { EditionService } from "../../../services/database/entities/edition.service";

@Injectable()
@ValidatorConstraint({ name: "EditionExists", async: true })
export class EditionIdExistsRule implements ValidatorConstraintInterface {
  constructor(private readonly editionService: EditionService) {}

  async validate(value: unknown): Promise<boolean> {
    if (typeof value !== "number") {
      return false;
    }

    const edition = await this.editionService.getAdminEditionById(value);

    return !!edition;
  }

  defaultMessage(validationArguments?: ValidationArguments): string {
    return "No edition with this ID exists";
  }
}
