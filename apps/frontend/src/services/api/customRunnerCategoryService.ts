import type {
  ApiResponse,
  DeleteCustomRunnerCategoryAdminApiRequest,
  GetCustomRunnerCategoriesAdminApiRequest,
  GetCustomRunnerCategoryAdminApiRequest,
  PatchCustomRunnerCategoryAdminApiRequest,
  PostCustomRunnerCategoryAdminApiRequest,
} from "@live24hisere/core/types";
import type { UrlId } from "../../types/utils/api";
import { performAuthenticatedApiRequest } from "./apiService";

export async function getAdminCustomRunnerCategories(
  accessToken: string,
): Promise<ApiResponse<GetCustomRunnerCategoriesAdminApiRequest>> {
  return await performAuthenticatedApiRequest<GetCustomRunnerCategoriesAdminApiRequest>(
    `/admin/custom-runner-categories`,
    accessToken,
  );
}

export async function getAdminCustomRunnerCategory(
  accessToken: string,
  categoryId: UrlId,
): Promise<ApiResponse<GetCustomRunnerCategoryAdminApiRequest>> {
  return await performAuthenticatedApiRequest<GetCustomRunnerCategoryAdminApiRequest>(
    `/admin/custom-runner-categories/${categoryId}`,
    accessToken,
  );
}

export async function postAdminCustomRunnerCategory(
  accessToken: string,
  category: PostCustomRunnerCategoryAdminApiRequest["payload"],
): Promise<ApiResponse<PostCustomRunnerCategoryAdminApiRequest>> {
  return await performAuthenticatedApiRequest<PostCustomRunnerCategoryAdminApiRequest>(
    "/admin/custom-runner-categories",
    accessToken,
    category,
    { method: "POST" },
  );
}

export async function patchAdminCustomRunnerCategory(
  accessToken: string,
  categoryId: UrlId,
  category: PatchCustomRunnerCategoryAdminApiRequest["payload"],
): Promise<ApiResponse<PatchCustomRunnerCategoryAdminApiRequest>> {
  return await performAuthenticatedApiRequest<PatchCustomRunnerCategoryAdminApiRequest>(
    `/admin/custom-runner-categories/${categoryId}`,
    accessToken,
    category,
    { method: "PATCH" },
  );
}

export async function deleteAdminCustomRunnerCategory(
  accessToken: string,
  categoryId: UrlId,
): Promise<ApiResponse<DeleteCustomRunnerCategoryAdminApiRequest>> {
  return await performAuthenticatedApiRequest<DeleteCustomRunnerCategoryAdminApiRequest>(
    `/admin/custom-runner-categories/${categoryId}`,
    accessToken,
    undefined,
    { method: "DELETE" },
  );
}
