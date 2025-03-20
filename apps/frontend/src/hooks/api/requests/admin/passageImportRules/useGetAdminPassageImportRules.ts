import { useQuery } from "@tanstack/react-query";
import { getAdminPassageImportRules } from "../../../../../services/api/passageImportRuleService";
import { useRequiredAccessToken } from "../../../useRequiredAccessToken";

export function useGetAdminPassageImportRules() {
  const accessToken = useRequiredAccessToken();

  return useQuery({
    queryKey: ["getAdminPassageImportRules"],
    queryFn: async () => await getAdminPassageImportRules(accessToken),
    retry: false,
    meta: {
      errorToast: "Une erreur est survenue lors de la récupération de la liste des règles d'import de passages.",
    },
  });
}
