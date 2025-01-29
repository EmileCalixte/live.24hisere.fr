import { useQuery } from "@tanstack/react-query";
import { getAdminEditionRaces } from "../../../../../services/api/raceService";
import type { UrlId } from "../../../../../types/utils/api";
import { useRequiredAccessToken } from "../../../useRequiredAccessToken";

export function useGetAdminEditionRaces(editionId: UrlId | undefined) {
  const accessToken = useRequiredAccessToken();

  return useQuery({
    queryKey: ["getAdminEditionRaces", editionId],
    queryFn: async () => {
      if (editionId === undefined) {
        return null;
      }

      return await getAdminEditionRaces(accessToken, editionId);
    },
    retry: false,
    enabled: editionId !== undefined,
    meta: {
      errorToast: "Une erreur est survenue lors de la récupération des courses de l'édition.",
    },
  });
}
