import { IsNotEmpty, IsString, MaxLength } from "class-validator";
import {
  CUSTOM_RUNNER_CATEGORY_CODE_MAX_LENGTH,
  CUSTOM_RUNNER_CATEGORY_NAME_MAX_LENGTH,
} from "@live24hisere/core/constants";
import { PostCustomRunnerCategoryAdminApiRequest } from "@live24hisere/core/types";

type PostCustomRunnerCategoryPayload = PostCustomRunnerCategoryAdminApiRequest["payload"];

export class CustomRunnerCategoryDto implements PostCustomRunnerCategoryPayload {
  @IsString()
  @IsNotEmpty()
  @MaxLength(CUSTOM_RUNNER_CATEGORY_CODE_MAX_LENGTH)
  code: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(CUSTOM_RUNNER_CATEGORY_NAME_MAX_LENGTH)
  name: string;
}
