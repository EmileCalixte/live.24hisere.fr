import { useMutation } from "@tanstack/react-query";
import { deleteAdminPassageImportRule } from "../../../../../services/api/passageImportRuleService";
import type { UrlId } from "../../../../../types/utils/api";
import { useRequiredAccessToken } from "../../../useRequiredAccessToken";

export function useDeleteAdminPassageImportRule(ruleId: UrlId | undefined) {
  const accessToken = useRequiredAccessToken();

  return useMutation({
    mutationFn: async () => {
      if (ruleId === undefined) {
        throw new Error("ruleId is undefined");
      }

      await deleteAdminPassageImportRule(accessToken, ruleId);
    },
    meta: {
      errorToast: "Une erreur est survenue lors de la suppression de la règle d'import de passages.",
      successToast: "Règle supprimée.",
    },
  });
}
