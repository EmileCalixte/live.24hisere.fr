import { useMutation } from "@tanstack/react-query";
import type { ApiPayload, PatchParticipantAdminApiRequest } from "@live24hisere/core/types";
import { patchAdminRaceRuner } from "../../../../../services/api/participantService";
import type { UrlId } from "../../../../../types/utils/api";
import { useRequiredAccessToken } from "../../../useRequiredAccessToken";

export function usePatchAdminRaceRunner(raceId: UrlId | undefined, runnerId: UrlId | undefined) {
  const accessToken = useRequiredAccessToken();

  return useMutation({
    mutationFn: async (participant: ApiPayload<PatchParticipantAdminApiRequest>) => {
      if (raceId === undefined) {
        throw new Error("raceId is undefined");
      }

      if (runnerId === undefined) {
        throw new Error("runnerId is undefined");
      }

      return await patchAdminRaceRuner(accessToken, raceId, runnerId, participant);
    },
    meta: {
      errorToast: "Une erreur est survenue lors de l'enregistrement du participant.",
      successToast: "Participant enregistré.",
    },
  });
}
