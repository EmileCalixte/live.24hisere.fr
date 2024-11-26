import { type AdminPassage } from "../Passage";
import {
  AdminRunner,
  type PublicRunner,
  type RaceRunner,
  type RaceRunnerWithPassages,
  RunnerWithRaceCount,
} from "../Runner";
import { type ApiRequest } from "./ApiRequest";

export interface GetRunnersApiRequest extends ApiRequest {
  payload: never;

  response: {
    runners: PublicRunner[];
  };
}

export interface GetRaceRunnersApiRequest extends ApiRequest {
  payload: never;

  response: {
    runners: RaceRunnerWithPassages[];
  };
}

export interface GetRunnersAdminApiRequest extends ApiRequest {
  payload: never;

  response: {
    runners: Array<RunnerWithRaceCount<AdminRunner>>;
  };
}

export interface GetRunnerAdminApiRequest extends ApiRequest {
  payload: never;

  response: {
    runner: RunnerWithRaceCount;
  };
}

export interface PostRunnerAdminApiRequest extends ApiRequest {
  payload: Omit<AdminRunner, "id" | "birthYear"> & { birthYear: number };

  response: {
    runner: RunnerWithRaceCount<AdminRunner>;
  };
}

export interface PostRunnersBulkAdminApiRequest extends ApiRequest {
  payload: Array<PostRunnerAdminApiRequest["payload"]>;

  response: {
    count: number;
  };
}

export interface PatchRunnerAdminApiRequest extends ApiRequest {
  payload: Partial<PostRunnerAdminApiRequest["payload"]>;

  response: PostRunnerAdminApiRequest["response"];
}

export interface DeleteRunnerAdminApiRequest extends ApiRequest {
  payload: never;

  response: never;
}
