import { useMutation } from "@tanstack/react-query";
import type { ApiPayload, PutRaceOrderAdminApiRequest } from "@live24hisere/core/types";
import { putAdminRaceOrder } from "../../../../../services/api/raceService";
import type { UrlId } from "../../../../../types/utils/api";
import { useRequiredAccessToken } from "../../../useRequiredAccessToken";

export function usePutAdminRaceOrder(editionId: UrlId | undefined) {
  const accessToken = useRequiredAccessToken();

  return useMutation({
    mutationFn: async (order: ApiPayload<PutRaceOrderAdminApiRequest>) => {
      if (editionId === undefined) {
        throw new Error("editionId is undefined");
      }

      return await putAdminRaceOrder(accessToken, editionId, order);
    },
    meta: {
      errorToast: "Une erreur est survenue lors de la sauvegarde de l'ordre des courses.",
      successToast: "Ordre enregistré.",
    },
  });
}
