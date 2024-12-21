import { Injectable } from "@nestjs/common";
import { ValidationArguments, ValidatorConstraint, ValidatorConstraintInterface } from "class-validator";
import { RunnerService } from "./../../../services/database/entities/runner.service";

@Injectable()
@ValidatorConstraint({ name: "RunnerExists", async: true })
export class RunnerIdExistsRule implements ValidatorConstraintInterface {
  constructor(private readonly runnerService: RunnerService) {}

  async validate(value: unknown): Promise<boolean> {
    if (typeof value !== "number") {
      return false;
    }

    const runner = await this.runnerService.getAdminRunnerById(value);

    return !!runner;
  }

  defaultMessage(validationArguments?: ValidationArguments): string {
    return "No runner with this ID exists";
  }
}
