import { useQuery } from "@tanstack/react-query";
import { getRunners } from "../../../../../services/api/runnerService";
import { DEFAULT_FETCH_INTERVAL } from "../../../../useIntervalApiRequest";

export function useGetPublicRunners() {
  return useQuery({
    queryKey: ["getPublicRunners"],
    queryFn: getRunners,
    refetchInterval: DEFAULT_FETCH_INTERVAL,
    retry: false,
    meta: {
      errorToast: "Une erreur est survenue lors de la récupération de la liste des coureurs.",
    },
  });
}
