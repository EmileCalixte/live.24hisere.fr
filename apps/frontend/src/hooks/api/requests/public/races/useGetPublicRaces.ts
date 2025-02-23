import { useQuery } from "@tanstack/react-query";
import { FETCH_INTERVAL } from "../../../../../constants/api";
import { getRaces } from "../../../../../services/api/raceService";

export function useGetPublicRaces() {
  return useQuery({
    queryKey: ["getPublicRaces"],
    queryFn: async () => await getRaces(),
    refetchInterval: FETCH_INTERVAL,
    retry: false,
    meta: {
      errorToast: "Une erreur est survenue lors de la récupération de la liste des courses.",
    },
  });
}
