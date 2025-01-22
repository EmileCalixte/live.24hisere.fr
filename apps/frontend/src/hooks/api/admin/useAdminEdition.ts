import { useQuery, type UseQueryResult } from "@tanstack/react-query";
import type { ApiResponse, GetEditionAdminApiRequest } from "@live24hisere/core/types";
import { getAdminEdition } from "../../../services/api/editionService";
import type { UrlId } from "../../../types/utils/api";
import { useRequiredAccessToken } from "../useRequiredAccessToken";

export function useAdminEdition(editionId: UrlId): UseQueryResult<ApiResponse<GetEditionAdminApiRequest>> {
  const accessToken = useRequiredAccessToken();

  return useQuery({
    queryKey: ["getAdminEdition", editionId],
    queryFn: async () => await getAdminEdition(accessToken, editionId),
    retry: false,
    meta: {
      notFoundToast: "Cette édition n'existe pas.",
      errorToast: "Une erreur est survenue lors de la récupération des détails de l'édition.",
    },
  });
}
