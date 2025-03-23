import type { PassageImportRule, PassageImportRuleWithRaceIds } from "../PassageImportRule";
import type { ApiRequest } from "./ApiRequest";

export interface GetPassageImportRulesAdminApiRequest extends ApiRequest {
  payload: never;

  response: {
    rules: PassageImportRuleWithRaceIds[];
  };
}

export interface GetPassageImportRuleAdminApiRequest extends ApiRequest {
  payload: never;

  response: {
    rule: PassageImportRuleWithRaceIds;
  };
}

export interface PostPassageImportRuleAdminApiRequest extends ApiRequest {
  payload: Omit<PassageImportRule, "id">;

  response: {
    rule: PassageImportRuleWithRaceIds;
  };
}

export interface PatchPassageImportRuleAdminApiRequest extends ApiRequest {
  payload: Partial<Omit<PassageImportRuleWithRaceIds, "id">>;

  response: {
    rule: PassageImportRuleWithRaceIds;
  };
}
