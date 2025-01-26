import { useMutation } from "@tanstack/react-query";
import type { ApiPayload, PatchRaceAdminApiRequest } from "@live24hisere/core/types";
import { patchAdminRace } from "../../../../../services/api/raceService";
import type { UrlId } from "../../../../../types/utils/api";
import { useRequiredAccessToken } from "../../../useRequiredAccessToken";

export function usePatchAdminRace(raceId: UrlId | undefined, refetch: (() => unknown) | undefined) {
  const accessToken = useRequiredAccessToken();

  return useMutation({
    mutationFn: async (race: ApiPayload<PatchRaceAdminApiRequest>) => {
      if (raceId === undefined) {
        throw new Error("raceId is undefined");
      }

      return await patchAdminRace(accessToken, raceId, race);
    },
    meta: {
      errorToast: "Une erreur est survenue lors de l'enregistrement de la course.",
      successToast: "Course enregistrée.",
    },
    onSuccess: () => {
      refetch?.();
    },
  });
}
