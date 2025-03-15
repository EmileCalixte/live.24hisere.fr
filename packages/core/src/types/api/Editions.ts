import type {
  AdminEdition,
  AdminEditionWithRaceAndRunnerCount,
  AdminEditionWithRaceCount,
  EditionWithRaceCount,
} from "../Edition";
import type { ApiRequest } from "./ApiRequest";

export interface GetEditionsApiRequest extends ApiRequest {
  payload: never;

  response: {
    editions: EditionWithRaceCount[];
  };
}

export interface GetEditionsAdminApiRequest extends ApiRequest {
  payload: never;

  response: {
    editions: AdminEditionWithRaceAndRunnerCount[];
  };
}

export interface GetEditionAdminApiRequest extends ApiRequest {
  payload: never;

  response: {
    edition: AdminEditionWithRaceCount;
  };
}

export interface PostEditionAdminApiRequest extends ApiRequest {
  payload: Omit<AdminEdition, "id">;

  response: {
    edition: AdminEditionWithRaceCount;
  };
}

export interface PatchEditionAdminApiRequest extends ApiRequest {
  payload: Partial<PostEditionAdminApiRequest["payload"]>;

  response: {
    edition: AdminEditionWithRaceCount;
  };
}

export interface DeleteEditionAdminApiRequest extends ApiRequest {
  payload: never;

  response: never;
}

export interface PutEditionOrderAdminApiRequest extends ApiRequest {
  payload: number[];

  response: never;
}
