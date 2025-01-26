import { useQuery } from "@tanstack/react-query";
import { getRaces } from "../../../../../services/api/raceService";
import type { UrlId } from "../../../../../types/utils/api";
import { DEFAULT_FETCH_INTERVAL } from "../../../../useIntervalApiRequest";

export function useGetPublicRaces(editionId: UrlId | undefined) {
  return useQuery({
    queryKey: ["getPublicRaces", editionId],
    queryFn: async () => {
      if (editionId === undefined) {
        return null;
      }

      return await getRaces(editionId);
    },
    refetchInterval: DEFAULT_FETCH_INTERVAL,
    retry: false,
    enabled: editionId !== undefined,
    meta: {
      errorToast: "Une erreur est survenue lors de la récupération de la liste des courses.",
    },
  });
}
