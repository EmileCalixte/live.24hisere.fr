import { useMutation } from "@tanstack/react-query";
import { deleteAdminRunner } from "../../../../../services/api/runnerService";
import type { UrlId } from "../../../../../types/utils/api";
import { useRequiredAccessToken } from "../../../useRequiredAccessToken";

export function useDeleteAdminRunner(runnerId: UrlId | undefined) {
  const accessToken = useRequiredAccessToken();

  return useMutation({
    mutationFn: async () => {
      if (runnerId === undefined) {
        throw new Error("editionId is undefined");
      }

      return await deleteAdminRunner(accessToken, runnerId);
    },
    meta: {
      errorToast: "Une erreur est survenue lors de la suppression du coureur.",
      successToast: "Coureur supprimé.",
    },
  });
}
