import { useMutation } from "@tanstack/react-query";
import type { ApiPayload, PatchPassageAdminApiRequest } from "@live24hisere/core/types";
import { patchAdminPassage } from "../../../../../services/api/passageService";
import type { UrlId } from "../../../../../types/utils/api";
import { useRequiredAccessToken } from "../../../useRequiredAccessToken";

export function usePatchAdminPassage() {
  const accessToken = useRequiredAccessToken();

  return useMutation({
    mutationFn: async ({
      passageId,
      passage,
    }: {
      passageId: UrlId;
      passage: ApiPayload<PatchPassageAdminApiRequest>;
    }) => await patchAdminPassage(accessToken, passageId, passage),
    meta: {
      errorToast: "Une erreur est survenue lors de l'enregistrement du passage.",
      successToast: "Passage enregistré.",
    },
  });
}
