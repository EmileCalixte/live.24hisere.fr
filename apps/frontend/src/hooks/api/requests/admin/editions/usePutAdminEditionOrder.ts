import { useMutation } from "@tanstack/react-query";
import type { ApiPayload, PutEditionOrderAdminApiRequest } from "@live24hisere/core/types";
import { putAdminEditionOrder } from "../../../../../services/api/editionService";
import { useRequiredAccessToken } from "../../../useRequiredAccessToken";

export function usePutAdminEditionOrder() {
  const accessToken = useRequiredAccessToken();

  return useMutation({
    mutationFn: async (order: ApiPayload<PutEditionOrderAdminApiRequest>) =>
      await putAdminEditionOrder(accessToken, order),
    meta: {
      errorToast: "Une erreur est survenue lors de la sauvegarde de l'ordre des éditions.",
      successToast: "Ordre enregistré.",
    },
  });
}
