import { useMutation } from "@tanstack/react-query";
import type { ApiPayload, PatchEditionAdminApiRequest } from "@live24hisere/core/types";
import { patchAdminEdition } from "../../../../../services/api/editionService";
import type { UrlId } from "../../../../../types/utils/api";
import { useRequiredAccessToken } from "../../../useRequiredAccessToken";

export function usePatchAdminEdition(editionId: UrlId | undefined) {
  const accessToken = useRequiredAccessToken();

  return useMutation({
    mutationFn: async (edition: ApiPayload<PatchEditionAdminApiRequest>) => {
      if (editionId === undefined) {
        throw new Error("editionId is undefined");
      }

      return await patchAdminEdition(accessToken, editionId, edition);
    },
    meta: {
      errorToast: "Une erreur est survenue lors de l'enregistrement de l'édition.",
      successToast: "Édition enregistrée.",
    },
  });
}
