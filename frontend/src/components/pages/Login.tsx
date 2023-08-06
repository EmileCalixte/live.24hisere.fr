import React, { useContext, useState } from "react";
import { Col, Row } from "react-bootstrap";
import { performAPIRequest } from "../../util/apiUtils";
import { userContext } from "../App";
import { Navigate } from "react-router-dom";
import ToastUtil from "../../util/ToastUtil";
import { Input } from "../ui/forms/Input";
import Page from "../ui/Page";

export default function Login(): JSX.Element {
    const { accessToken, saveAccessToken, setUser } = useContext(userContext);

    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [submitButtonDisabled, setSubmitButtonDisabled] = useState(false);
    const [loggedIn, setLoggedIn] = useState(accessToken !== null);

    const onSubmit = async (e: React.FormEvent): Promise<void> => {
        e.preventDefault();
        setSubmitButtonDisabled(true);

        const response = await performAPIRequest("/auth/login", {
            method: "POST",
            body: new URLSearchParams({ // x-www-form-urlencoded
                username,
                password,
            }),
        });

        const responseJson = await response.json();

        if (!response.ok) {
            if (response.status === 403) {
                ToastUtil.getToastr().error("Identifiants incorrects");
            } else {
                ToastUtil.getToastr().error("Une erreur est survenue");
            }
            setSubmitButtonDisabled(false);
            return;
        }

        const accessToken = responseJson.accessToken;

        saveAccessToken(accessToken);
        setUser(undefined); // Will be defined when the application has fetched user info
        setLoggedIn(true);
    };

    if (loggedIn) {
        return (
            <Navigate to="/admin" replace={true} />
        );
    }

    return (
        <Page id="login" title="Connexion">
            <Row>
                <Col xl={3} lg={4} md={6} sm={12}>
                    <h1>Connexion</h1>
                    <form onSubmit={e => { void onSubmit(e); }}>
                        <Input label="Nom d'utilisateur"
                               name="username"
                               value={username}
                               autoFocus
                               onChange={e => { setUsername(e.target.value); }}
                        />

                        <Input label="Mot de passe"
                               className="mt-3"
                               type="password"
                               name="password"
                               value={password}
                               onChange={e => { setPassword(e.target.value); }}
                        />

                        <button className="button mt-3"
                                type="submit"
                                disabled={submitButtonDisabled}
                        >
                            Connexion
                        </button>
                    </form>
                </Col>
            </Row>
        </Page>
    );
}
