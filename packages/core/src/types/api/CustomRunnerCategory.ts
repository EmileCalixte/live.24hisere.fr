import type { CustomRunnerCategory } from "../CustomRunnerCategory";
import type { ApiRequest } from "./ApiRequest";

export interface PostCustomRunnerCategoryAdminApiRequest extends ApiRequest {
  payload: Omit<CustomRunnerCategory, "id">;

  response: {
    customRunnerCategory: CustomRunnerCategory;
  };
}

export interface PatchCustomRunnerCategoryAdminApiRequest extends ApiRequest {
  payload: Partial<PostCustomRunnerCategoryAdminApiRequest["payload"]>;

  response: {
    customRunnerCategory: CustomRunnerCategory;
  };
}
