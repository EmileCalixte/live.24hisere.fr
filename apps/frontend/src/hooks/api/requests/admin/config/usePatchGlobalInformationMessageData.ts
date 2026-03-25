import { useMutation } from "@tanstack/react-query";
import type { ApiPayload, PatchGlobalInformationMessageDataAdminApiRequest } from "@live24hisere/core/types";
import { patchGlobalInformationMessageData } from "../../../../../services/api/configService";
import { useRequiredAccessToken } from "../../../useRequiredAccessToken";

export function usePatchGlobalInformationMessageData() {
  const accessToken = useRequiredAccessToken();

  return useMutation({
    mutationFn: async (data: ApiPayload<PatchGlobalInformationMessageDataAdminApiRequest>) =>
      await patchGlobalInformationMessageData(accessToken, data),
    meta: {
      errorToast: "Une erreur est survenue lors de l'enregistrement des paramètres.",
      successToast: "Paramètres enregistrés.",
    },
  });
}
