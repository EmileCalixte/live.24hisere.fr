import { useMutation } from "@tanstack/react-query";
import type { ApiPayload, PostRaceAdminApiRequest } from "@live24hisere/core/types";
import { postAdminRace } from "../../../../../services/api/raceService";
import { useRequiredAccessToken } from "../../../useRequiredAccessToken";

export function usePostAdminRace() {
  const accessToken = useRequiredAccessToken();

  return useMutation({
    mutationFn: async (race: ApiPayload<PostRaceAdminApiRequest>) => await postAdminRace(accessToken, race),
    meta: {
      errorToast: "Une erreur est survenue lors de la création de la course.",
      successToast: "Course créée.",
    },
  });
}
