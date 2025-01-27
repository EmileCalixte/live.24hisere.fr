import { useMutation } from "@tanstack/react-query";
import type { ApiPayload, PostPassageAdminApiRequest } from "@live24hisere/core/types";
import { postAdminPassage } from "../../../../../services/api/passageService";
import { useRequiredAccessToken } from "../../../useRequiredAccessToken";

export function usePostAdminPassage() {
  const accessToken = useRequiredAccessToken();

  return useMutation({
    mutationFn: async (passage: ApiPayload<PostPassageAdminApiRequest>) => await postAdminPassage(accessToken, passage),
    meta: {
      errorToast: "Une erreur est survenue lors de la création du passage.",
      successToast: "Passage créé.",
    },
  });
}
