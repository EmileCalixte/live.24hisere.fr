import type { PassageImportRuleWithRaceIds } from "../PassageImportRule";
import type { ApiRequest } from "./ApiRequest";

export interface GetPassageImportRulesAdminApiRequest extends ApiRequest {
  payload: never;

  response: {
    rules: PassageImportRuleWithRaceIds[];
  };
}
