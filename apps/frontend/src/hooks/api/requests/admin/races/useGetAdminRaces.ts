import { useQuery } from "@tanstack/react-query";
import { getAdminRaces } from "../../../../../services/api/raceService";
import { DEFAULT_FETCH_INTERVAL } from "../../../../useIntervalApiRequest";
import { useRequiredAccessToken } from "../../../useRequiredAccessToken";

export function useGetAdminRaces(fetchPeriodically = false) {
  const accessToken = useRequiredAccessToken();

  return useQuery({
    queryKey: ["getAdminRaces"],
    queryFn: async () => await getAdminRaces(accessToken),
    retry: false,
    refetchInterval: fetchPeriodically && DEFAULT_FETCH_INTERVAL,
    meta: {
      errorToast: "Une erreur est survenue lors de la récupération de la liste des courses.",
    },
  });
}
