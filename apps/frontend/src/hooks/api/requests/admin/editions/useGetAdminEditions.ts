import { useQuery } from "@tanstack/react-query";
import { getAdminEditions } from "../../../../../services/api/editionService";
import { DEFAULT_FETCH_INTERVAL } from "../../../../useIntervalApiRequest";
import { useRequiredAccessToken } from "../../../useRequiredAccessToken";

export function useGetAdminEditions(fetchPeriodically = false) {
  const accessToken = useRequiredAccessToken();

  return useQuery({
    queryKey: ["getAdminEditions"],
    queryFn: async () => await getAdminEditions(accessToken),
    retry: false,
    refetchInterval: fetchPeriodically && DEFAULT_FETCH_INTERVAL,
    meta: {
      errorToast: "Une erreur est survenue lors de la récupération de la liste des éditions.",
    },
  });
}
