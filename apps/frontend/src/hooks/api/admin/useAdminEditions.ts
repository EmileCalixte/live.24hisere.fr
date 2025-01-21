import { useQuery, type UseQueryResult } from "@tanstack/react-query";
import type { ApiResponse, GetEditionsAdminApiRequest } from "@live24hisere/core/types";
import { getAdminEditions } from "../../../services/api/editionService";
import { DEFAULT_FETCH_INTERVAL } from "../../useIntervalApiRequest";
import { useRequiredAccessToken } from "../useRequiredAccessToken";

export function useAdminEditions(fetchPeriodically = false): UseQueryResult<ApiResponse<GetEditionsAdminApiRequest>> {
  const accessToken = useRequiredAccessToken();

  return useQuery({
    queryKey: ["getAdminEditions"],
    queryFn: async () => await getAdminEditions(accessToken),
    retry: false,
    refetchInterval: fetchPeriodically && DEFAULT_FETCH_INTERVAL,
    meta: {
      errorMessage: "Une erreur est survenue lors de la récupération de la liste des éditions.",
    },
  });
}
