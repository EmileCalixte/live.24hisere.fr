import { useQuery } from "@tanstack/react-query";
import { getDisabledAppData } from "../../../../../services/api/configService";
import { useRequiredAccessToken } from "../../../useRequiredAccessToken";

export function useGetDisabledAppData() {
  const accessToken = useRequiredAccessToken();

  return useQuery({
    queryKey: ["getDisabledAppData"],
    queryFn: async () => await getDisabledAppData(accessToken),
    retry: false,
    meta: {
      errorToast: "Une erreur est survenue lors de la récupération des données d'accès à l'application.",
    },
  });
}
