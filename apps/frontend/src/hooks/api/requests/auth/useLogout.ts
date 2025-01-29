import { useMutation } from "@tanstack/react-query";
import { logout } from "../../../../services/api/authService";

export function useLogout() {
  return useMutation({
    mutationFn: async (accessToken: string) => await logout(accessToken),
    meta: {
      errorToast: "Une erreur est survenue.",
      successToast: "Vous avez été déconnecté.",
    },
  });
}
