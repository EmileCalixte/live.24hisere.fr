import { useMutation } from "@tanstack/react-query";
import type { ApiPayload, PostParticipantAdminApiRequest } from "@live24hisere/core/types";
import { postAdminRaceRunner } from "../../../../../services/api/participantService";
import type { UrlId } from "../../../../../types/utils/api";
import { useRequiredAccessToken } from "../../../useRequiredAccessToken";

export function usePostAdminRaceRunner(raceId: UrlId | undefined) {
  const accessToken = useRequiredAccessToken();

  return useMutation({
    mutationFn: async (participant: ApiPayload<PostParticipantAdminApiRequest>) => {
      if (raceId === undefined) {
        throw new Error("raceId is undefined");
      }

      return await postAdminRaceRunner(accessToken, raceId, participant);
    },
    meta: {
      errorToast: "Une erreur est survenue lors de la création du participant.",
      successToast: "Participant créé.",
    },
  });
}
