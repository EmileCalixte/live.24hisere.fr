import { useQuery } from "@tanstack/react-query";
import { getAdminCustomRunnerCategories } from "../../../../../services/api/customRunnerCategoryService";
import { useRequiredAccessToken } from "../../../useRequiredAccessToken";

export function useGetAdminCustomRunnerCategories() {
  const accessToken = useRequiredAccessToken();

  return useQuery({
    queryKey: ["getAdminCustomRunnerCategories"],
    queryFn: async () => await getAdminCustomRunnerCategories(accessToken),
    retry: false,
    meta: {
      errorToast:
        "Une erreur est survenue lors de la récupération de la liste des catégories de coureurs personnalisées.",
    },
  });
}
