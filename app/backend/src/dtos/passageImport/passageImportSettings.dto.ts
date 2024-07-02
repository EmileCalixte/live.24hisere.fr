import { IsString, IsUrl } from "class-validator";

export class PassageImportSettingsDto {
    @IsString()
    @IsUrl()
    dagFileUrl: string;
}
