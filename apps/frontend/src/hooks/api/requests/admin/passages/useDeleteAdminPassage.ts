import { useMutation } from "@tanstack/react-query";
import { deleteAdminPassage } from "../../../../../services/api/passageService";
import type { UrlId } from "../../../../../types/utils/api";
import { useRequiredAccessToken } from "../../../useRequiredAccessToken";

export function useDeleteAdminPassage() {
  const accessToken = useRequiredAccessToken();

  return useMutation({
    mutationFn: async (passageId: UrlId) => await deleteAdminPassage(accessToken, passageId),
    meta: {
      errorToast: "Une erreur est survenue lors de la suppression du passage.",
      successToast: "Passage supprimé.",
    },
  });
}
