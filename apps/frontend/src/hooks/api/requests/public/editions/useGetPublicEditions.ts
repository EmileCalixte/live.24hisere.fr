import { useQuery } from "@tanstack/react-query";
import { FETCH_INTERVAL } from "../../../../../constants/api";
import { getEditions } from "../../../../../services/api/editionService";

export function useGetPublicEditions() {
  return useQuery({
    queryKey: ["getPublicEditions"],
    queryFn: getEditions,
    refetchInterval: FETCH_INTERVAL,
    retry: false,
    meta: {
      errorToast: "Une erreur est survenue lors de la récupération de la liste des éditions.",
    },
  });
}
