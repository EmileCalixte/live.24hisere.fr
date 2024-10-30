import { IsBoolean, IsNotEmpty } from "class-validator";
import { PostRunnerPassageAdminApiRequest } from "@live24hisere/core/types";
import { IsISO8601UTCDateString } from "../../validation/validators/IsISO8601UTCDateString";

type PostPassagePayload = PostRunnerPassageAdminApiRequest["payload"];

export class PassageDto implements PostPassagePayload {
    @IsBoolean()
    @IsNotEmpty()
    isHidden: boolean;

    @IsISO8601UTCDateString()
    @IsNotEmpty()
    time: string;
}
