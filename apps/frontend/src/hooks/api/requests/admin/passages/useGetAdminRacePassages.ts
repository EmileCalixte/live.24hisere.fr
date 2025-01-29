import { useQuery } from "@tanstack/react-query";
import { FETCH_INTERVAL } from "../../../../../constants/api";
import { getAdminRacePassages } from "../../../../../services/api/passageService";
import type { UrlId } from "../../../../../types/utils/api";
import { useRequiredAccessToken } from "../../../useRequiredAccessToken";

export function useGetAdminRacePassages(raceId: UrlId | undefined, fetchPeriodically = false) {
  const accessToken = useRequiredAccessToken();

  return useQuery({
    queryKey: ["getAdminRacePassages", raceId],
    queryFn: async () => {
      if (raceId === undefined) {
        return null;
      }

      return await getAdminRacePassages(accessToken, raceId);
    },
    retry: false,
    refetchInterval: fetchPeriodically && FETCH_INTERVAL,
    enabled: raceId !== undefined,
    meta: {
      errorToast: "Une erreur est survenue lors de la récupération des passages de la course.",
    },
  });
}
