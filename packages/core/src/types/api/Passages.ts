import { type AdminPassage, type AdminPassageWithRunnerIdAndRaceId } from "../Passage";
import { type ApiRequest } from "./ApiRequest";

export interface GetAllPassagesOfRaceAdminApiRequest extends ApiRequest {
  payload: never;

  response: {
    passages: AdminPassageWithRunnerIdAndRaceId[];
  };
}

export interface PostPassageAdminApiRequest extends ApiRequest {
  payload: Omit<AdminPassageWithRunnerIdAndRaceId, "id" | "detectionId" | "importTime">;

  response: {
    passage: AdminPassage;
  };
}

export interface PatchPassageAdminApiRequest extends ApiRequest {
  payload: Partial<Omit<PostPassageAdminApiRequest["payload"], "raceId" | "runnerId">>;

  response: {
    passage: AdminPassage;
  };
}

export interface DeletePassageAdminApiRequest extends ApiRequest {
  payload: never;

  response: never;
}
