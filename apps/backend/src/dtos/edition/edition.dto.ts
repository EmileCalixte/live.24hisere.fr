import { IsBoolean, IsNotEmpty, IsString, MaxLength } from "class-validator";
import { EDITION_NAME_MAX_LENGTH } from "@live24hisere/core/constants";
import { PostEditionAdminApiRequest } from "@live24hisere/core/types";

type PostEditionPayload = PostEditionAdminApiRequest["payload"];

export class EditionDto implements PostEditionPayload {
  @IsString()
  @IsNotEmpty()
  @MaxLength(EDITION_NAME_MAX_LENGTH)
  name: string;

  @IsBoolean()
  @IsNotEmpty()
  isPublic: boolean;
}
