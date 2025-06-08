import type {
  CustomRunnerCategory,
  CustomRunnerCategoryWithRunnerCount,
  CustomRunnerCategoryWithRunners,
} from "../CustomRunnerCategory";
import type { ApiRequest } from "./ApiRequest";

export interface GetCustomRunnerCategoriesAdminApiRequest extends ApiRequest {
  payload: never;

  response: {
    customRunnerCategories: CustomRunnerCategoryWithRunnerCount[];
  };
}

export interface GetCustomRunnerCategoryAdminApiRequest extends ApiRequest {
  payload: never;

  response: {
    customRunnerCategory: CustomRunnerCategoryWithRunners;
  };
}

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

export interface DeleteCustomRunnerCategoryAdminApiRequest extends ApiRequest {
  payload: never;

  response: never;
}
