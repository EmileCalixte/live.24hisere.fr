import { type AdminPassage, type AdminPassageWithRunnerId } from "../Passage";
import { type ApiRequest } from "./ApiRequest";

export interface GetAllPassagesAdminApiRequest extends ApiRequest {
  payload: never;

  response: {
    passages: AdminPassageWithRunnerId[];
  };
}

export interface PostRunnerPassageAdminApiRequest extends ApiRequest {
  payload: Omit<AdminPassage, "id" | "detectionId" | "importTime">;

  response: {
    passage: AdminPassage;
  };
}

export interface PatchRunnerPassageAdminApiRequest extends ApiRequest {
  payload: Partial<PostRunnerPassageAdminApiRequest["payload"]>;

  response: {
    passage: AdminPassage;
  };
}

export interface DeleteAdminRunnerPassageApiRequest extends ApiRequest {
  payload: never;

  response: never;
}
