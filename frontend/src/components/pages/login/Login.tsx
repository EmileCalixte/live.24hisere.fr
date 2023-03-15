import React, {useContext, useState} from "react";
import {performAPIRequest} from "../../../util/apiUtils";
import {userContext} from "../../App";
import {Navigate} from "react-router-dom";
import ToastUtil from "../../../util/ToastUtil";

export default function Login() {
    const {accessToken, saveAccessToken, setUser} = useContext(userContext);

    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [submitButtonDisabled, setSubmitButtonDisabled] = useState(false);
    const [loggedIn, setLoggedIn] = useState(accessToken !== null);

    const onSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSubmitButtonDisabled(true);

        const formData = new FormData();
        formData.append("username", username);
        formData.append("password", password);

        const response = await performAPIRequest("/auth/login", {
            method: "POST",
            body: formData,
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
        <div id="page-login">
            <div className="row">
                <div className="col-12">
                    <h1>Connexion</h1>
                </div>
            </div>
            <div className="row">
                <div className="col-xl-3 col-lg-4 col-md-6 col-sm-12">
                    <form onSubmit={onSubmit}>
                        <div className="input-group">
                            <label>
                                Nom d'utilisateur
                                <input className="input"
                                       type="text"
                                       value={username}
                                       name="username"
                                       autoFocus={true}
                                       onChange={(e) => setUsername(e.target.value)}
                                />
                            </label>
                        </div>

                        <div className="input-group">
                            <label>
                                Mot de passe<br />
                                <input className="input"
                                       type="password"
                                       value={password}
                                       name="password"
                                       onChange={(e) => setPassword(e.target.value)}
                                />
                            </label>
                        </div>

                        <button className="button mt-3"
                                type="submit"
                                disabled={submitButtonDisabled}
                        >
                            Connexion
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
}
