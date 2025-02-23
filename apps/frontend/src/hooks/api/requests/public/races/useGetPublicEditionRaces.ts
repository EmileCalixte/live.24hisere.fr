import { useQuery } from "@tanstack/react-query";
import { FETCH_INTERVAL } from "../../../../../constants/api";
import { getEditionRaces } from "../../../../../services/api/raceService";
import type { UrlId } from "../../../../../types/utils/api";

export function useGetPublicEditionRaces(editionId: UrlId | undefined) {
  return useQuery({
    queryKey: ["getPublicRaces", editionId],
    queryFn: async () => {
      if (editionId === undefined) {
        return null;
      }

      return await getEditionRaces(editionId);
    },
    refetchInterval: FETCH_INTERVAL,
    retry: false,
    enabled: editionId !== undefined,
    meta: {
      errorToast: "Une erreur est survenue lors de la récupération de la liste des courses.",
    },
  });
}
