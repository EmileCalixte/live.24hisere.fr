import { useQuery } from "@tanstack/react-query";
import { getPublicRunnerParticipations } from "../../../../../services/api/participantService";
import type { UrlId } from "../../../../../types/utils/api";

export function useGetPublicRunnerParticipations(runnerId: UrlId | undefined) {
  return useQuery({
    queryKey: ["getPublicRunnerParticipations", runnerId],
    queryFn: async () => {
      if (runnerId === undefined) {
        return null;
      }

      return await getPublicRunnerParticipations(runnerId);
    },
    retry: false,
    enabled: runnerId !== undefined,
    meta: {
      errorToast: "Une erreur est survenue lors de la récupération des participations du coureur.",
    },
  });
}
