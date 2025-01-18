import { useQuery } from "@tanstack/react-query";
import { getEditions } from "../../services/api/editionService";
import { DEFAULT_FETCH_INTERVAL } from "../useIntervalApiRequest";

// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
export function usePublicEditions() {
  return useQuery({
    queryKey: ["getPublicEditions"],
    queryFn: getEditions,
    refetchInterval: DEFAULT_FETCH_INTERVAL,
    retry: false,
    meta: {
      errorMessage: "Une erreur est survenue lors de la récupération de la liste des éditions.",
    },
  });
}
