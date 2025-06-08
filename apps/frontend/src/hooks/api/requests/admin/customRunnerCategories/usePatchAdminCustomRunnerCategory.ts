import { useMutation } from "@tanstack/react-query";
import type { ApiPayload, PatchCustomRunnerCategoryAdminApiRequest } from "@live24hisere/core/types";
import { patchAdminCustomRunnerCategory } from "../../../../../services/api/customRunnerCategoryService";
import type { UrlId } from "../../../../../types/utils/api";
import { useRequiredAccessToken } from "../../../useRequiredAccessToken";

export function usePatchAdminCustomRunnerCategory(categoryId: UrlId | undefined) {
  const accessToken = useRequiredAccessToken();

  return useMutation({
    mutationFn: async (category: ApiPayload<PatchCustomRunnerCategoryAdminApiRequest>) => {
      if (categoryId === undefined) {
        throw new Error("categoryId is undefined");
      }

      return await patchAdminCustomRunnerCategory(accessToken, categoryId, category);
    },
    meta: {
      errorToast: "Une erreur est survenue lors de l'enregistrement de la catégorie de coureurs personnalisée.",
      successToast: "Catégorie de coureurs personnalisée enregistrée.",
    },
  });
}
