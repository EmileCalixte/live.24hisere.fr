import { useQuery } from "@tanstack/react-query";
import { getAdminRacePassages } from "../../../../../services/api/passageService";
import type { UrlId } from "../../../../../types/utils/api";
import { DEFAULT_FETCH_INTERVAL } from "../../../../useIntervalApiRequest";
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
    refetchInterval: fetchPeriodically && DEFAULT_FETCH_INTERVAL,
    enabled: raceId !== undefined,
    meta: {
      errorToast: "Une erreur est survenue lors de la récupération des passages de la course.",
    },
  });
}
