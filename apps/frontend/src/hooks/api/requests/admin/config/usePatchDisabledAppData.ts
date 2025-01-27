import { useMutation } from "@tanstack/react-query";
import type { ApiPayload, PatchDisabledAppDataAdminApiRequest } from "@live24hisere/core/types";
import { patchDisabledAppData } from "../../../../../services/api/configService";
import { useRequiredAccessToken } from "../../../useRequiredAccessToken";

export function usePatchDisabledAppData(refetch: (() => unknown) | undefined) {
  const accessToken = useRequiredAccessToken();

  return useMutation({
    mutationFn: async (data: ApiPayload<PatchDisabledAppDataAdminApiRequest>) =>
      await patchDisabledAppData(accessToken, data),
    meta: {
      errorToast: "Une erreur est survenue lors de l'enregistrement des paramètres.",
      successToast: "Paramètres enregistrés.",
    },
    onSuccess: () => {
      refetch?.();
    },
  });
}
