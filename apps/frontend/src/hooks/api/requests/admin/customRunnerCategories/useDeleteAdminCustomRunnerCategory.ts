import { useMutation } from "@tanstack/react-query";
import { deleteAdminCustomRunnerCategory } from "../../../../../services/api/customRunnerCategoryService";
import type { UrlId } from "../../../../../types/utils/api";
import { useRequiredAccessToken } from "../../../useRequiredAccessToken";

export function useDeleteAdminCustomRunnerCategory(categoryId: UrlId | undefined) {
  const accessToken = useRequiredAccessToken();

  return useMutation({
    mutationFn: async () => {
      if (categoryId === undefined) {
        throw new Error("categoryId is undefined");
      }

      return await deleteAdminCustomRunnerCategory(accessToken, categoryId);
    },
    meta: {
      errorToast: "Une erreur est survenue lors de la suppression de la catégorie personnalisée de coureurs.",
      successToast: "Catégorie de coureurs personnalisée supprimée.",
    },
  });
}
