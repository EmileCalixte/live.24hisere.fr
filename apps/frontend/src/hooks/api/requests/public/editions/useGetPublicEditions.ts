import { useQuery } from "@tanstack/react-query";
import { getEditions } from "../../../../../services/api/editionService";
import { DEFAULT_FETCH_INTERVAL } from "../../../../useIntervalApiRequest";

export function useGetPublicEditions() {
  return useQuery({
    queryKey: ["getPublicEditions"],
    queryFn: getEditions,
    refetchInterval: DEFAULT_FETCH_INTERVAL,
    retry: false,
    meta: {
      errorToast: "Une erreur est survenue lors de la récupération de la liste des éditions.",
    },
  });
}
