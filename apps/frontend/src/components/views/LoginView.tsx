import React from "react";
import { Col, Row } from "react-bootstrap";
import { Navigate } from "react-router-dom";
import { appContext } from "../../contexts/AppContext";
import { useLogin } from "../../hooks/api/requests/auth/useLogin";
import { Input } from "../ui/forms/Input";
import Page from "../ui/Page";

export default function LoginView(): React.ReactElement {
  const { accessToken, saveAccessToken, setUser } = React.useContext(appContext).user;

  const loginMutation = useLogin();

  const [username, setUsername] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [loggedIn, setLoggedIn] = React.useState(accessToken !== null);

  const onSubmit: React.FormEventHandler = (e) => {
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
    <Page id="login" title="Connexion">
      <Row>
        <Col xl={3} lg={4} md={6} sm={12}>
          <h1>Connexion</h1>
          <form onSubmit={onSubmit}>
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
              className="mt-3"
              type="password"
              name="password"
              value={password}
              autoComplete="current-password"
              onChange={(e) => {
                setPassword(e.target.value);
              }}
            />

            <button className="button mt-3" type="submit" disabled={loginMutation.isPending || !username || !password}>
              Connexion
            </button>
          </form>
        </Col>
      </Row>
    </Page>
  );
}
