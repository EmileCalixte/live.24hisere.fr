import { useMutation } from "@tanstack/react-query";
import type { ApiPayload, LoginApiRequest } from "@live24hisere/core/types";
import { login } from "../../../../services/api/authService";

export function useLogin() {
  return useMutation({
    mutationFn: async (credentials: ApiPayload<LoginApiRequest>) =>
      await login(credentials.username, credentials.password),
    meta: {
      unauthorizedToast: "Identifiants incorrects.",
      errorToast: "Une erreur est survenue.",
    },
  });
}
