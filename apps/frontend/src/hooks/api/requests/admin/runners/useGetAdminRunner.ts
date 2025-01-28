import { useQuery } from "@tanstack/react-query";
import { getAdminRunner } from "../../../../../services/api/runnerService";
import type { UrlId } from "../../../../../types/utils/api";
import { useRequiredAccessToken } from "../../../useRequiredAccessToken";

export function useGetAdminRunner(runnerId: UrlId | undefined) {
  const accessToken = useRequiredAccessToken();

  return useQuery({
    queryKey: ["getAdminRunner", runnerId],
    queryFn: async () => {
      if (runnerId === undefined) {
        return null;
      }

      return await getAdminRunner(accessToken, runnerId);
    },
    retry: false,
    enabled: runnerId !== undefined,
    meta: {
      notFoundToast: "Ce coureur n'existe pas.",
      errorToast: "Une erreur est survenue lors de la récupération des détails du coureur.",
    },
  });
}
