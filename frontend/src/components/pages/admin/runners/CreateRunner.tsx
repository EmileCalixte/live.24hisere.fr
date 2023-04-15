import React, {useCallback, useContext, useEffect, useState} from "react";
import {Col, Row} from "react-bootstrap";
import {Navigate} from "react-router-dom";
import {type AdminRaceWithRunnerCount} from "../../../../types/Race";
import {Gender} from "../../../../types/Runner";
import {performAuthenticatedAPIRequest} from "../../../../util/apiUtils";
import ToastUtil from "../../../../util/ToastUtil";
import {userContext} from "../../../App";
import Breadcrumbs from "../../../layout/breadcrumbs/Breadcrumbs";
import Crumb from "../../../layout/breadcrumbs/Crumb";
import Page from "../../../layout/Page";
import RunnerDetailsForm from "../../../pageParts/admin/runners/RunnerDetailsForm";

export default function CreateRunner() {
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
        const response = await performAuthenticatedAPIRequest("/admin/races", accessToken);
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

        const response = await performAuthenticatedAPIRequest("/admin/runners", accessToken, {
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
        <Page id="admin-create-runner" title={"Créer un coureur"}>
            <Row>
                <Col>
                    <Breadcrumbs>
                        <Crumb url="/admin" label="Administration" />
                        <Crumb url="/admin/runners" label="Coureurs" />
                        <Crumb label="Créer un coureur" />
                    </Breadcrumbs>
                </Col>
            </Row>

            <Row>
                <Col xxl={3} xl={4} lg={6} md={9} sm={12}>
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
                </Col>
            </Row>
        </Page>
    );
}
