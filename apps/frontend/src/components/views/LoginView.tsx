import React from "react";
import { Col, Row } from "react-bootstrap";
import { Navigate } from "react-router-dom";
import { login } from "../../services/api/authService";
import ToastService from "../../services/ToastService";
import { isApiRequestResultOk } from "../../utils/apiUtils";
import { appContext } from "../App";
import { Input } from "../ui/forms/Input";
import Page from "../ui/Page";

export default function LoginView(): React.ReactElement {
  const { accessToken, saveAccessToken, setUser } = React.useContext(appContext).user;

  const [username, setUsername] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [submitButtonDisabled, setSubmitButtonDisabled] = React.useState(false);
  const [loggedIn, setLoggedIn] = React.useState(accessToken !== null);

  const onSubmit = async (e: React.FormEvent): Promise<void> => {
    e.preventDefault();
    setSubmitButtonDisabled(true);

    const result = await login(username, password);

    if (!isApiRequestResultOk(result)) {
      if (result.response.status === 403) {
        ToastService.getToastr().error("Identifiants incorrects");
      } else {
        ToastService.getToastr().error("Une erreur est survenue");
      }
      setSubmitButtonDisabled(false);
      return;
    }

    const accessToken = result.json.accessToken;

    saveAccessToken(accessToken);
    setUser(undefined); // Will be defined when the application has fetched user info
    setLoggedIn(true);
  };

  if (loggedIn) {
    return <Navigate to="/admin" replace={true} />;
  }

  return (
    <Page id="login" title="Connexion">
      <Row>
        <Col xl={3} lg={4} md={6} sm={12}>
          <h1>Connexion</h1>
          <form
            onSubmit={(e) => {
              void onSubmit(e);
            }}
          >
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

            <button className="button mt-3" type="submit" disabled={submitButtonDisabled}>
              Connexion
            </button>
          </form>
        </Col>
      </Row>
    </Page>
  );
}
