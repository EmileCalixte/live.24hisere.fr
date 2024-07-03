import { PartialType } from "@nestjs/mapped-types";
import { PassageDto } from "./passage.dto";

export class UpdatePassageDto extends PartialType(PassageDto) {}
