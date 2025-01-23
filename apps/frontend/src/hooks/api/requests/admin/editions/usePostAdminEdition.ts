import { useMutation } from "@tanstack/react-query";
import type { ApiPayload, PostEditionAdminApiRequest } from "@live24hisere/core/types";
import { postAdminEdition } from "../../../../../services/api/editionService";
import { useRequiredAccessToken } from "../../../useRequiredAccessToken";

export function usePostAdminEdition() {
  const accessToken = useRequiredAccessToken();

  return useMutation({
    mutationFn: async (edition: ApiPayload<PostEditionAdminApiRequest>) => await postAdminEdition(accessToken, edition),
    meta: {
      errorToast: "Une erreur est survenue lors de la création de l'édition.",
      successToast: "Édition créée.",
    },
  });
}
