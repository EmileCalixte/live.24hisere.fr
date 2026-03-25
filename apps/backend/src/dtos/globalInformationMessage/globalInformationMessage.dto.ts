import { IsBoolean, IsDefined, IsString, MaxLength } from "class-validator";
import { CONFIG_VALUE_MAX_LENGTH } from "../../constants/config.constants";

export class GlobalInformationMessageDto {
  @IsBoolean()
  @IsDefined()
  isGlobalInformationMessageVisible: boolean;

  @IsString()
  @IsDefined()
  @MaxLength(CONFIG_VALUE_MAX_LENGTH)
  globalInformationMessage?: string;
}
