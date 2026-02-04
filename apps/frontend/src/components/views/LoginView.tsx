import React from "react";
import { Navigate } from "react-router-dom";
import { appContext } from "../../contexts/AppContext";
import { useLogin } from "../../hooks/api/requests/auth/useLogin";
import type { FormSubmitEventHandler } from "../../types/utils/react";
import { Card } from "../ui/Card";
import { Button } from "../ui/forms/Button";
import { Input } from "../ui/forms/Input";
import Page from "../ui/Page";

export default function LoginView(): React.ReactElement {
  const { accessToken, saveAccessToken, setUser } = React.useContext(appContext).user;

  const loginMutation = useLogin();

  const [username, setUsername] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [loggedIn, setLoggedIn] = React.useState(accessToken !== null);

  const onSubmit: FormSubmitEventHandler = (e) => {
    e.preventDefault();

    loginMutation.mutate(
      { username, password },
      {
        onSuccess: ({ accessToken }) => {
          saveAccessToken(accessToken);
          setUser(undefined); // Will be defined when the application has fetched user info
          setLoggedIn(true);
        },
      },
    );
  };

  if (loggedIn) {
    return <Navigate to="/admin" replace={true} />;
  }

  return (
    <Page id="login" htmlTitle="Connexion" title="Connexion">
      <Card>
        <div className="w-full md:w-1/2 xl:w-1/4">
          <form onSubmit={onSubmit} className="flex flex-col gap-3">
            <Input
              label="Nom d'utilisateur"
              name="username"
              value={username}
              autoFocus
              autoComplete="username"
              onChange={(e) => {
                setUsername(e.target.value);
              }}
            />

            <Input
              label="Mot de passe"
              type="password"
              name="password"
              value={password}
              autoComplete="current-password"
              onChange={(e) => {
                setPassword(e.target.value);
              }}
            />

            <div>
              <Button type="submit" disabled={loginMutation.isPending || !username || !password}>
                Connexion
              </Button>
            </div>
          </form>
        </div>
      </Card>
    </Page>
  );
}
