import { useMutation } from "@tanstack/react-query";
import { deleteAdminParticipant } from "../../../../../services/api/participantService";
import type { UrlId } from "../../../../../types/utils/api";
import { useRequiredAccessToken } from "../../../useRequiredAccessToken";

export function useDeleteAdminRaceRunner(raceId: UrlId | undefined, runnerId: UrlId | undefined) {
  const accessToken = useRequiredAccessToken();

  return useMutation({
    mutationFn: async () => {
      if (raceId === undefined) {
        throw new Error("raceId is undefined");
      }

      if (runnerId === undefined) {
        throw new Error("runnerId is undefined");
      }

      return await deleteAdminParticipant(accessToken, raceId, runnerId);
    },
    meta: {
      errorToast: "Une erreur est survenue lors de la suppression du participant.",
      successToast: "Participant supprimé.",
    },
  });
}
