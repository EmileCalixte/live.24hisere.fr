import { type Participant } from "../Participant";
import { type AdminRaceRunnerWithPassages } from "../Runner";
import { type ApiRequest } from "./ApiRequest";

export interface GetRunnerParticipationsAdminApiRequest extends ApiRequest {
  payload: never;

  response: {
    participations: Participant[];
  };
}

export interface GetRaceParticipantAdminApiRequest extends ApiRequest {
  payload: never;

  response: {
    runner: AdminRaceRunnerWithPassages;
  };
}
