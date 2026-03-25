import { useQuery } from "@tanstack/react-query";
import { getGlobalInformationMessageData } from "../../../../../services/api/configService";
import { useRequiredAccessToken } from "../../../useRequiredAccessToken";

export function useGetGlobalInformationMessageData() {
  const accessToken = useRequiredAccessToken();

  return useQuery({
    queryKey: ["getGlobalInformationMessageData"],
    queryFn: async () => await getGlobalInformationMessageData(accessToken),
    retry: false,
    meta: {
      errorToast: "Une erreur est survenue lors de la récupération des données du message d'information global.",
    },
  });
}
