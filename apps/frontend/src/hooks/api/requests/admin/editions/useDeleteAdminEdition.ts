import { useMutation } from "@tanstack/react-query";
import { deleteAdminEdition } from "../../../../../services/api/editionService";
import type { UrlId } from "../../../../../types/utils/api";
import { useRequiredAccessToken } from "../../../useRequiredAccessToken";

export function useDeleteAdminEdition(editionId: UrlId | undefined) {
  const accessToken = useRequiredAccessToken();

  return useMutation({
    mutationFn: async () => {
      if (editionId === undefined) {
        throw new Error("editionId is undefined");
      }

      return await deleteAdminEdition(accessToken, editionId);
    },
    meta: {
      errorToast: "Une erreur est survenue lors de la suppression de l'édition.",
      successToast: "Édition supprimée.",
    },
  });
}
