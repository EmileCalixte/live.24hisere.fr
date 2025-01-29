import { useQuery } from "@tanstack/react-query";
import { getAdminRaceRunner } from "../../../../../services/api/participantService";
import type { UrlId } from "../../../../../types/utils/api";
import { useRequiredAccessToken } from "../../../useRequiredAccessToken";

export function useGetAdminRaceRunner(raceId: UrlId | undefined, runnerId: UrlId | undefined) {
  const accessToken = useRequiredAccessToken();

  return useQuery({
    queryKey: ["getAdminRaceRunner", raceId, runnerId],
    queryFn: async () => {
      if (raceId === undefined || runnerId === undefined) {
        return null;
      }

      return await getAdminRaceRunner(accessToken, raceId, runnerId);
    },
    retry: false,
    enabled: raceId !== undefined && runnerId !== undefined,
    meta: {
      errorToast: "Une erreur est survenue lors de la récupération des détails du participant.",
    },
  });
}
