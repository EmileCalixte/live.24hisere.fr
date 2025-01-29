import { useMutation } from "@tanstack/react-query";
import type { ApiPayload, PostRunnerAdminApiRequest } from "@live24hisere/core/types";
import { postAdminRunner } from "../../../../../services/api/runnerService";
import { useRequiredAccessToken } from "../../../useRequiredAccessToken";

export function usePostAdminRunner() {
  const accessToken = useRequiredAccessToken();

  return useMutation({
    mutationFn: async (runner: ApiPayload<PostRunnerAdminApiRequest>) => await postAdminRunner(accessToken, runner),
    meta: {
      errorToast: "Une erreur est survenue lors de la création du coureur.",
      successToast: "Coureur créé.",
    },
  });
}
