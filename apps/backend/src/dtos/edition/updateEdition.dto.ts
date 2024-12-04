import { PartialType } from "@nestjs/mapped-types";
import { PatchEditionAdminApiRequest } from "@live24hisere/core/types";
import { EditionDto } from "./edition.dto";

type PatchEditionPayload = PatchEditionAdminApiRequest["payload"];

export class UpdateEditionDto extends PartialType(EditionDto) implements PatchEditionPayload {}
