import { IsBoolean, IsDefined, IsString, MaxLength } from "class-validator";
import { CONFIG_VALUE_MAX_LENGTH } from "../../constants/config.constants";

export class DisabledAppDto {
  @IsBoolean()
  @IsDefined()
  isAppEnabled: boolean;

  @IsString()
  @IsDefined()
  @MaxLength(CONFIG_VALUE_MAX_LENGTH)
  disabledAppMessage?: string;
}
