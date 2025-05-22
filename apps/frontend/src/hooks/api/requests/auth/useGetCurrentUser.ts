import { useQuery } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { FETCH_INTERVAL_SLOWER } from "../../../../constants/api";
import { getCurrentUserInfo } from "../../../../services/api/authService";
import { is401Error } from "../../../../utils/apiUtils";

export function useGetCurrentUser(accessToken: string | null, forgetAccessToken: () => unknown) {
  const navigate = useNavigate();

  return useQuery({
    queryKey: ["getCurrentUser", accessToken],
    queryFn: async () => {
      if (!accessToken) {
        throw new Error("No access token");
      }

      try {
        return await getCurrentUserInfo(accessToken);
      } catch (error) {
        if (is401Error(error)) {
          await navigate("/");
          forgetAccessToken();
        }

        throw error;
      }
    },
    enabled: !!accessToken,
    refetchInterval: FETCH_INTERVAL_SLOWER,
    retry: false,
    meta: {
      unauthorizedToast: "Vous avez été déconnecté.",
      errorToast: "Une erreur est survenue lors de la récupération de vos informations d'utilisateur.",
    },
  });
}
