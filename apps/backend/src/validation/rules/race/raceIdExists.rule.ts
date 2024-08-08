import { Injectable } from "@nestjs/common";
import {
    ValidationArguments,
    ValidatorConstraint,
    ValidatorConstraintInterface,
} from "class-validator";
import { RaceService } from "src/services/database/entities/race.service";

@Injectable()
@ValidatorConstraint({ name: "RaceExists", async: true })
export class RaceIdExistsRule implements ValidatorConstraintInterface {
    constructor(private readonly raceService: RaceService) {}

    async validate(value: unknown): Promise<boolean> {
        if (typeof value !== "number") {
            return false;
        }

        const race = await this.raceService.getRace({ id: value });

        return !!race;
    }

    defaultMessage(validationArguments?: ValidationArguments): string {
        return "No race with this ID exists";
    }
}
