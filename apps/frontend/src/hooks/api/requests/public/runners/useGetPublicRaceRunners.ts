import { useQuery } from "@tanstack/react-query";
import { getRaceRunners } from "../../../../../services/api/runnerService";
import type { UrlId } from "../../../../../types/utils/api";
import { DEFAULT_FETCH_INTERVAL } from "../../../../useIntervalApiRequest";

export function useGetPublicRaceRunners(raceId: UrlId | undefined) {
  return useQuery({
    queryKey: ["getPublicRaceRunners", raceId],
    queryFn: async () => {
      if (raceId === undefined) {
        return null;
      }

      return await getRaceRunners(raceId);
    },
    refetchInterval: DEFAULT_FETCH_INTERVAL,
    retry: false,
    enabled: raceId !== undefined,
    meta: {
      errorToast: "Une erreur est survenue lors de la récupération des coureurs.",
    },
  });
}
