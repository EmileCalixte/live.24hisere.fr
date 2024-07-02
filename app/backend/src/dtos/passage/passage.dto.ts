import { IsBoolean, IsNotEmpty } from "class-validator";
import { IsISO8601UTCDateString } from "../../validation/validators/IsISO8601UTCDateString";

export class PassageDto {
    @IsBoolean()
    @IsNotEmpty()
    isHidden: boolean;

    @IsISO8601UTCDateString()
    @IsNotEmpty()
    time: string;
}
