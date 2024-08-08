import { PartialType } from "@nestjs/mapped-types";
import { PassageImportSettingsDto } from "./passageImportSettings.dto";

export class UpdatePassageImportSettingsDto extends PartialType(
    PassageImportSettingsDto,
) {}
