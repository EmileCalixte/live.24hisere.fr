import { useMutation } from "@tanstack/react-query";
import type { ApiPayload, PatchPassageImportSettingsAdminApiRequest } from "@live24hisere/core/types";
import { patchPassageImportSettings } from "../../../../../services/api/configService";
import { useRequiredAccessToken } from "../../../useRequiredAccessToken";

export function usePatchPassageImportSettings(refetch: (() => unknown) | undefined) {
  const accessToken = useRequiredAccessToken();

  return useMutation({
    mutationFn: async (settings: ApiPayload<PatchPassageImportSettingsAdminApiRequest>) =>
      await patchPassageImportSettings(accessToken, settings),
    meta: {
      errorToast: "Une erreur est survenue lors de l'enregistrement des paramètres.",
      successToast: "Paramètres enregistrés.",
    },
    onSuccess: () => {
      refetch?.();
    },
  });
}
