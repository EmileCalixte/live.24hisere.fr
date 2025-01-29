import { useQuery } from "@tanstack/react-query";
import { FETCH_INTERVAL } from "../../../../../constants/api";
import { getRunners } from "../../../../../services/api/runnerService";

export function useGetPublicRunners() {
  return useQuery({
    queryKey: ["getPublicRunners"],
    queryFn: getRunners,
    refetchInterval: FETCH_INTERVAL,
    retry: false,
    meta: {
      errorToast: "Une erreur est survenue lors de la récupération de la liste des coureurs.",
    },
  });
}
