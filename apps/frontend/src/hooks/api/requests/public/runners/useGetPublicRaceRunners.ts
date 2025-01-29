import { useQuery } from "@tanstack/react-query";
import { FETCH_INTERVAL } from "../../../../../constants/api";
import { getRaceRunners } from "../../../../../services/api/runnerService";
import type { UrlId } from "../../../../../types/utils/api";

export function useGetPublicRaceRunners(raceId: UrlId | undefined) {
  return useQuery({
    queryKey: ["getPublicRaceRunners", raceId],
    queryFn: async () => {
      if (raceId === undefined) {
        return null;
      }

      return await getRaceRunners(raceId);
    },
    refetchInterval: FETCH_INTERVAL,
    retry: false,
    enabled: raceId !== undefined,
    meta: {
      errorToast: "Une erreur est survenue lors de la récupération des coureurs.",
    },
  });
}
