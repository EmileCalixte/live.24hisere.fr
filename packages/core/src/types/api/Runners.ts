import { type AdminPassage } from "../Passage";
import { type RaceRunner, type RunnerWithPassages } from "../Runner";
import { type ApiRequest } from "./ApiRequest";

export interface GetRunnersApiRequest extends ApiRequest {
  payload: never;

  response: {
    runners: RaceRunner[];
  };
}

export interface GetRaceRunnersApiRequest extends ApiRequest {
  payload: never;

  response: {
    runners: RunnerWithPassages[];
  };
}

export interface GetRunnersAdminApiRequest extends ApiRequest {
  payload: never;

  response: {
    runners: RaceRunner[];
  };
}

export interface GetRunnerAdminApiRequest extends ApiRequest {
  payload: never;

  response: {
    runner: RunnerWithPassages<RaceRunner, AdminPassage>;
  };
}

export interface PostRunnerAdminApiRequest extends ApiRequest {
  payload: Omit<RaceRunner, "birthYear"> & { birthYear: number };

  response: {
    runner: RunnerWithPassages<RaceRunner, AdminPassage>;
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

  response: {
    runner: RaceRunner;
  };
}

export interface DeleteRunnerAdminApiRequest extends ApiRequest {
  payload: never;

  response: never;
}
