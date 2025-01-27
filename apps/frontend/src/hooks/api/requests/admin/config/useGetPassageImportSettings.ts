import { useQuery } from "@tanstack/react-query";
import { getPassageImportSettings } from "../../../../../services/api/configService";
import { useRequiredAccessToken } from "../../../useRequiredAccessToken";

export function useGetPassageImportSettings() {
  const accessToken = useRequiredAccessToken();

  return useQuery({
    queryKey: ["getPassageImportSettings"],
    queryFn: async () => await getPassageImportSettings(accessToken),
    retry: false,
    meta: {
      errorToast: "Une erreur est survenue lors de la récupération des paramètres d'import.",
    },
  });
}
