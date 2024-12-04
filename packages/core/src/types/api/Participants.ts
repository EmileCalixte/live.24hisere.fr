import { type Participant } from "../Participant";
import { type ApiRequest } from "./ApiRequest";

export interface GetRunnerParticipationsAdminApiRequest extends ApiRequest {
  payload: never;

  response: {
    participations: Participant[];
  };
}
