import { useQuery } from "@tanstack/react-query";
import { getAdminRunners } from "../../../../../services/api/runnerService";
import { useRequiredAccessToken } from "../../../useRequiredAccessToken";

export function useGetAdminRunners() {
  const accessToken = useRequiredAccessToken();

  return useQuery({
    queryKey: ["getAdminRunners"],
    queryFn: async () => await getAdminRunners(accessToken),
    retry: false,
    meta: {
      errorToast: "Une erreur est survenue lors de la récupération de la liste des coureurs.",
    },
  });
}
