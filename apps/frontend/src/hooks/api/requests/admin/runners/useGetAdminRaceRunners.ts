import { useQuery } from "@tanstack/react-query";
import { FETCH_INTERVAL } from "../../../../../constants/api";
import { getAdminRaceRunners } from "../../../../../services/api/runnerService";
import type { UrlId } from "../../../../../types/utils/api";
import { useRequiredAccessToken } from "../../../useRequiredAccessToken";

export function useGetAdminRaceRunners(raceId: UrlId | undefined, fetchPeriodically = false) {
  const accessToken = useRequiredAccessToken();

  return useQuery({
    queryKey: ["getAdminRaceRunners", raceId],
    queryFn: async () => {
      if (raceId === undefined) {
        return null;
      }

      return await getAdminRaceRunners(accessToken, raceId);
    },
    retry: false,
    refetchInterval: fetchPeriodically && FETCH_INTERVAL,
    enabled: raceId !== undefined,
    meta: {
      errorToast: "Une erreur est survenue lors de la récupération des coureurs participant à la course.",
    },
  });
}
