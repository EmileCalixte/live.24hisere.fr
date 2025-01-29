import { useQuery } from "@tanstack/react-query";
import { FETCH_INTERVAL } from "../../../../../constants/api";
import { getAdminEditions } from "../../../../../services/api/editionService";
import { useRequiredAccessToken } from "../../../useRequiredAccessToken";

export function useGetAdminEditions(fetchPeriodically = false) {
  const accessToken = useRequiredAccessToken();

  return useQuery({
    queryKey: ["getAdminEditions"],
    queryFn: async () => await getAdminEditions(accessToken),
    retry: false,
    refetchInterval: fetchPeriodically && FETCH_INTERVAL,
    meta: {
      errorToast: "Une erreur est survenue lors de la récupération de la liste des éditions.",
    },
  });
}
