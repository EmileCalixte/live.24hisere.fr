import { useQuery } from "@tanstack/react-query";
import { getAdminRaceRunners } from "../../../../../services/api/runnerService";
import type { UrlId } from "../../../../../types/utils/api";
import { DEFAULT_FETCH_INTERVAL } from "../../../../useIntervalApiRequest";
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
    refetchInterval: fetchPeriodically && DEFAULT_FETCH_INTERVAL,
    enabled: raceId !== undefined,
    meta: {
      errorToast: "Une erreur est survenue lors de la récupération des coureurs participant à la course.",
    },
  });
}
