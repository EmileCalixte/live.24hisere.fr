import { useQuery } from "@tanstack/react-query";
import { FETCH_INTERVAL } from "../../../../../constants/api";
import { getAdminRaces } from "../../../../../services/api/raceService";
import { useRequiredAccessToken } from "../../../useRequiredAccessToken";

export function useGetAdminRaces(fetchPeriodically = false) {
  const accessToken = useRequiredAccessToken();

  return useQuery({
    queryKey: ["getAdminRaces"],
    queryFn: async () => await getAdminRaces(accessToken),
    retry: false,
    refetchInterval: fetchPeriodically && FETCH_INTERVAL,
    meta: {
      errorToast: "Une erreur est survenue lors de la récupération de la liste des courses.",
    },
  });
}
