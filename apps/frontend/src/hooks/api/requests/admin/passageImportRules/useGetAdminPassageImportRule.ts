import { useQuery } from "@tanstack/react-query";
import { getAdminPassageImportRule } from "../../../../../services/api/passageImportRuleService";
import type { UrlId } from "../../../../../types/utils/api";
import { useRequiredAccessToken } from "../../../useRequiredAccessToken";

export function useGetAdminPassageImportRule(ruleId: UrlId) {
  const accessToken = useRequiredAccessToken();

  return useQuery({
    queryKey: ["getAdminPassageImportRule", ruleId],
    queryFn: async () => await getAdminPassageImportRule(accessToken, ruleId),
    retry: false,
    meta: {
      notFoundToast: "Cette règle d'import de passages n'existe pas.",
      errorToast: "Une erreur est survenue lors de la récupération des détails de la règle d'import de passages.",
    },
  });
}
