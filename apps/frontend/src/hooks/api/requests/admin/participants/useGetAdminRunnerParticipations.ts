import { useQuery } from "@tanstack/react-query";
import { getAdminRunnerParticipations } from "../../../../../services/api/participantService";
import type { UrlId } from "../../../../../types/utils/api";
import { useRequiredAccessToken } from "../../../useRequiredAccessToken";

export function useGetAdminRunnerParticipations(runnerId: UrlId | undefined) {
  const accessToken = useRequiredAccessToken();

  return useQuery({
    queryKey: ["getAdminRunnerParticipations", runnerId],
    queryFn: async () => {
      if (runnerId === undefined) {
        return null;
      }

      return await getAdminRunnerParticipations(accessToken, runnerId);
    },
    retry: false,
    enabled: runnerId !== undefined,
    meta: {
      errorToast: "Une erreur est survenue lors de la récupération des participations du coureur.",
    },
  });
}
