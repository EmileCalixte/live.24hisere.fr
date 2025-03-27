import { useMutation } from "@tanstack/react-query";
import type { ApiPayload, PostPassageImportRuleAdminApiRequest } from "@live24hisere/core/types";
import { postAdminPassageImportRule } from "../../../../../services/api/passageImportRuleService";
import { useRequiredAccessToken } from "../../../useRequiredAccessToken";

export function usePostAdminPassageImportRule() {
  const accessToken = useRequiredAccessToken();

  return useMutation({
    mutationFn: async (rule: ApiPayload<PostPassageImportRuleAdminApiRequest>) =>
      await postAdminPassageImportRule(accessToken, rule),
    meta: {
      errorToast: "Une erreur est survenue lors de la création de la règle d'import de passages.",
      successToast: "Règle créée.",
    },
  });
}
