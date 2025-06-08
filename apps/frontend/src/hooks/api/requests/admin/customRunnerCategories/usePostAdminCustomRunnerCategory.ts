import { useMutation } from "@tanstack/react-query";
import type { ApiPayload, PostCustomRunnerCategoryAdminApiRequest } from "@live24hisere/core/types";
import { postAdminCustomRunnerCategory } from "../../../../../services/api/customRunnerCategoryService";
import { useRequiredAccessToken } from "../../../useRequiredAccessToken";

export function usePostAdminCustomRunnerCategory() {
  const AccessToken = useRequiredAccessToken();

  return useMutation({
    mutationFn: async (category: ApiPayload<PostCustomRunnerCategoryAdminApiRequest>) =>
      await postAdminCustomRunnerCategory(AccessToken, category),
    meta: {
      errorToast: "Une erreur est survenue lors de la création de la catégorie de coureurs personnalisée.",
      successToast: "Catégorie de coureurs personnalisée créée.",
    },
  });
}
