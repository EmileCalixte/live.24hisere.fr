import { useMutation } from "@tanstack/react-query";
import type { ApiPayload, PatchPassageImportRuleAdminApiRequest } from "@live24hisere/core/types";
import { patchAdminPassageImportRule } from "../../../../../services/api/passageImportRuleService";
import type { UrlId } from "../../../../../types/utils/api";
import { useRequiredAccessToken } from "../../../useRequiredAccessToken";

export function usePatchAdminPassageImportRule(ruleId: UrlId | undefined) {
  const accessToken = useRequiredAccessToken();

  return useMutation({
    mutationFn: async (rule: ApiPayload<PatchPassageImportRuleAdminApiRequest>) => {
      if (ruleId === undefined) {
        throw new Error("ruleId is undefined");
      }

      await patchAdminPassageImportRule(accessToken, ruleId, rule);
    },
    meta: {
      errorToast: "Une erreur est survenue lors de l'enregistrement de la règle d'import de passages.",
      successToast: "Règle enregistrée.",
    },
  });
}
