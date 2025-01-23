import { useQuery } from "@tanstack/react-query";
import { getAdminEdition } from "../../../../../services/api/editionService";
import type { UrlId } from "../../../../../types/utils/api";
import { useRequiredAccessToken } from "../../../useRequiredAccessToken";

export function useGetAdminEdition(editionId: UrlId | undefined) {
  const accessToken = useRequiredAccessToken();

  return useQuery({
    queryKey: ["getAdminEdition", editionId],
    queryFn: async () => {
      if (editionId === undefined) {
        return null;
      }

      return await getAdminEdition(accessToken, editionId);
    },
    retry: false,
    enabled: editionId !== undefined,
    meta: {
      notFoundToast: "Cette édition n'existe pas.",
      errorToast: "Une erreur est survenue lors de la récupération des détails de l'édition.",
    },
  });
}
