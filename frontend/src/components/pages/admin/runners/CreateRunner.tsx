import React, {useCallback, useContext, useEffect, useState} from "react";
import {Navigate} from "react-router-dom";
import {type AdminRaceWithRunnerCount} from "../../../../types/Race";
import {Gender} from "../../../../types/Runner";
import ApiUtil from "../../../../util/ApiUtil";
import ToastUtil from "../../../../util/ToastUtil";
import {userContext} from "../../../App";
import Breadcrumbs from "../../../layout/breadcrumbs/Breadcrumbs";
import Crumb from "../../../layout/breadcrumbs/Crumb";
import RunnerDetailsForm from "./RunnerDetailsForm";

const CreateRunner = () => {
    const {accessToken} = useContext(userContext);

    const [races, setRaces] = useState<AdminRaceWithRunnerCount[] | false>(false);

    const [id, setId] = useState(1);
    const [firstname, setFirstname] = useState("");
    const [lastname, setLastname] = useState("");
    const [gender, setGender] = useState(Gender.M);
    const [birthYear, setBirthYear] = useState(((new Date()).getFullYear() - 30).toString());
    const [raceId, setRaceId] = useState<number | null>(null);

    const [isSaving, setIsSaving] = useState(false);

    const [redirectToId, setRedirectToId] = useState(null);

    const fetchRaces = useCallback(async () => {
        const response = await ApiUtil.performAuthenticatedAPIRequest("/admin/races", accessToken);
        const responseJson = await response.json();

        const responseRaces = responseJson.races as AdminRaceWithRunnerCount[];

        if (responseRaces.length < 1) {
            ToastUtil.getToastr().warning("Aucune course n'a été créée. Au moins une course doit exister pour enregistrer un coureur.");
        }

        setRaces(responseRaces);

        if (raceId === null && responseRaces.length > 0) {
            setRaceId(responseRaces[0].id);
        }
    }, [accessToken, raceId]);

    const onSubmit = useCallback(async (e: React.FormEvent) => {
        e.preventDefault();

        setIsSaving(true);

        const body = {
            id,
            firstname,
            lastname,
            gender,
            birthYear,
            raceId,
        };

        const response = await ApiUtil.performAuthenticatedAPIRequest("/admin/runners", accessToken, {
            method: "POST",
            body: JSON.stringify(body),
        });

        const responseJson = await response.json();

        if (!response.ok) {
            ToastUtil.getToastr().error("Une erreur est survenue");
            console.error(responseJson);
            setIsSaving(false);
            return;
        }

        ToastUtil.getToastr().success("Coureur créé");
        setRedirectToId(responseJson.id);
    }, [accessToken, id, firstname, lastname, gender, birthYear, raceId]);

    useEffect(() => {
        fetchRaces();
    }, [fetchRaces]);

    if (redirectToId) {
        return (
            <Navigate to={`/admin/runners/${redirectToId}`} />
        );
    }

    return (
        <div id="page-admin-create-runner">
            <div className="row">
                <div className="col-12">
                    <Breadcrumbs>
                        <Crumb url="/admin" label="Administration" />
                        <Crumb url="/admin/runners" label="Coureurs" />
                        <Crumb label="Créer un coureur" />
                    </Breadcrumbs>
                </div>
            </div>

            <div className="row">
                <div className="col-xl-4 col-lg-6 col-md-9 col-12">
                    <h2>Créer un coureur</h2>

                    <RunnerDetailsForm onSubmit={onSubmit}
                                       id={id}
                                       setId={setId}
                                       firstname={firstname}
                                       setFirstname={setFirstname}
                                       lastname={lastname}
                                       setLastname={setLastname}
                                       gender={gender}
                                       setGender={setGender}
                                       birthYear={birthYear}
                                       setBirthYear={setBirthYear}
                                       races={races}
                                       raceId={raceId ?? 0}
                                       setRaceId={setRaceId}
                                       submitButtonDisabled={isSaving || (races && races.length < 1)}
                    />
                </div>
            </div>
        </div>
    );
};

export default CreateRunner;
