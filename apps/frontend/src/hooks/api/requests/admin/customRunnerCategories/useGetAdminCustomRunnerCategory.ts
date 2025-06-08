import { useQuery } from "@tanstack/react-query";
import { getAdminCustomRunnerCategory } from "../../../../../services/api/customRunnerCategoryService";
import type { UrlId } from "../../../../../types/utils/api";
import { useRequiredAccessToken } from "../../../useRequiredAccessToken";

export function useGetAdminCustomRunnerCategory(categoryId: UrlId | undefined) {
  const accessToken = useRequiredAccessToken();

  return useQuery({
    queryKey: ["getAdminCustomRunnerCategory", categoryId],
    queryFn: async () => {
      if (categoryId === undefined) {
        return null;
      }

      return await getAdminCustomRunnerCategory(accessToken, categoryId);
    },
    retry: false,
    enabled: categoryId !== undefined,
    meta: {
      notFoundToast: "Cette catégorie de coureurs personnalisée n'existe pas.",
      errorToast:
        "Une erreur est survenue lors de la récupération des détails de la catégorie de coureurs personnalisée.",
    },
  });
}
