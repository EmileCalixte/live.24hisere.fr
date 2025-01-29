import { useMutation } from "@tanstack/react-query";
import type { ApiPayload, PatchRunnerAdminApiRequest } from "@live24hisere/core/types";
import { patchAdminRunner } from "../../../../../services/api/runnerService";
import type { UrlId } from "../../../../../types/utils/api";
import { useRequiredAccessToken } from "../../../useRequiredAccessToken";

export function usePatchAdminRunner(runnerId: UrlId | undefined) {
  const accessToken = useRequiredAccessToken();

  return useMutation({
    mutationFn: async (runner: ApiPayload<PatchRunnerAdminApiRequest>) => {
      if (runnerId === undefined) {
        throw new Error("runnerId is undefined");
      }

      return await patchAdminRunner(accessToken, runnerId, runner);
    },
    meta: {
      errorToast: "Une erreur est survenue lors de l'enregistrement du coureur.",
      successToast: "Coureur enregistré.",
    },
  });
}
