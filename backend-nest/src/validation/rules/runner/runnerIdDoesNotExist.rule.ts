import { Injectable } from "@nestjs/common";
import { type ValidationArguments, ValidatorConstraint, type ValidatorConstraintInterface } from "class-validator";
import { RunnerService } from "../../../services/database/entities/runner.service";

@Injectable()
@ValidatorConstraint({ name: "RunnerIdDoesNotExist", async: true })
export class RunnerIdDoesNotExistRule implements ValidatorConstraintInterface {
    constructor(
        private readonly runnerService: RunnerService,
    ) {}

    async validate(value: unknown): Promise<boolean> {
        if (typeof value !== "number") {
            return true;
        }

        const existingRunner = await this.runnerService.getRunner({ id: value });

        return !existingRunner;
    }

    defaultMessage(validationArguments?: ValidationArguments): string {
        return "A runner with the same ID already exists";
    }
}
