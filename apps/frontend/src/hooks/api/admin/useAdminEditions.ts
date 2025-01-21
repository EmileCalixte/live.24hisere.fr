import { useQuery, type UseQueryResult } from "@tanstack/react-query";
import type { ApiResponse, GetEditionsAdminApiRequest } from "@live24hisere/core/types";
import { getAdminEditions } from "../../../services/api/editionService";
import { useRequiredAccessToken } from "../useRequiredAccessToken";

export function useAdminEditions(): UseQueryResult<ApiResponse<GetEditionsAdminApiRequest>> {
  const accessToken = useRequiredAccessToken();

  return useQuery({
    queryKey: ["getAdminEditions"],
    queryFn: async () => await getAdminEditions(accessToken),
    retry: false,
    meta: {
      errorMessage: "Une erreur est survenue lors de la récupération de la liste des éditions.",
    },
  });
}
