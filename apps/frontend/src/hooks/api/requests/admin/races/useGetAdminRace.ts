import { useQuery } from "@tanstack/react-query";
import { getAdminRace } from "../../../../../services/api/raceService";
import type { UrlId } from "../../../../../types/utils/api";
import { useRequiredAccessToken } from "../../../useRequiredAccessToken";

export function useGetAdminRace(raceId: UrlId | undefined) {
  const accessToken = useRequiredAccessToken();

  return useQuery({
    queryKey: ["getAdminRace", raceId],
    queryFn: async () => {
      if (raceId === undefined) {
        return null;
      }

      return await getAdminRace(accessToken, raceId);
    },
    retry: false,
    enabled: raceId !== undefined,
    meta: {
      notFoundToast: "Cette course n'existe pas.",
      errorToast: "Une erreur est survenue lors de la récupération des détails de la course.",
    },
  });
}
