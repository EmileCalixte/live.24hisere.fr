import { PartialType } from "@nestjs/mapped-types";
import { DisabledAppDto } from "./disabledApp.dto";

export class UpdateDisabledAppDto extends PartialType(DisabledAppDto) {}
