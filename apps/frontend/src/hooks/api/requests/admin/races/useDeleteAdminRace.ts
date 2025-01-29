import { useMutation } from "@tanstack/react-query";
import { deleteAdminRace } from "../../../../../services/api/raceService";
import type { UrlId } from "../../../../../types/utils/api";
import { useRequiredAccessToken } from "../../../useRequiredAccessToken";

export function useDeleteAdminRace(raceId: UrlId | undefined) {
  const accessToken = useRequiredAccessToken();

  return useMutation({
    mutationFn: async () => {
      if (raceId === undefined) {
        throw new Error("raceId is undefined");
      }

      return await deleteAdminRace(accessToken, raceId);
    },
    meta: {
      errorToast: "Une erreur est survenue lors de la suppression de la course.",
      successToast: "Course supprimée.",
    },
  });
}
