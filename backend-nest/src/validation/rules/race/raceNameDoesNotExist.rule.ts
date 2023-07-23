import { Injectable } from "@nestjs/common";
import { type ValidationArguments, ValidatorConstraint, type ValidatorConstraintInterface } from "class-validator";
import { RaceService } from "../../../services/database/entities/race.service";

@Injectable()
@ValidatorConstraint({ name: "RaceNameDoesNotExist", async: true })
export class RaceNameDoesNotExistRule implements ValidatorConstraintInterface {
    constructor(
        private readonly raceService: RaceService,
    ) {}

    async validate(value: unknown): Promise<boolean> {
        if (typeof value !== "string") {
            return true;
        }

        const existingRace = await this.raceService.getAdminRace({ name: value });

        return !existingRace;
    }

    defaultMessage(validationArguments?: ValidationArguments): string {
        return "A race with the same name already exists";
    }
}
