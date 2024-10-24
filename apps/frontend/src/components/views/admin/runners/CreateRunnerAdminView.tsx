import React, { useCallback, useContext, useEffect, useState } from "react";
import { Col, Row } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { GENDER } from "@live24hisere/constants/runners";
import {
    type AdminRaceWithRunnerCount,
    type Gender,
} from "@live24hisere/types";
import { useStateWithNonNullableSetter } from "../../../../hooks/useStateWithNonNullableSetter";
import { getAdminRaces } from "../../../../services/api/RaceService";
import { postAdminRunner } from "../../../../services/api/RunnerService";
import ToastService from "../../../../services/ToastService";
import { isApiRequestResultOk } from "../../../../utils/apiUtils";
import { appContext } from "../../../App";
import Breadcrumbs from "../../../ui/breadcrumbs/Breadcrumbs";
import Crumb from "../../../ui/breadcrumbs/Crumb";
import Page from "../../../ui/Page";
import RunnerDetailsForm from "../../../viewParts/admin/runners/RunnerDetailsForm";

export default function CreateRunnerAdminView(): React.ReactElement {
    const navigate = useNavigate();

    const { accessToken } = useContext(appContext).user;

    const [races, setRaces] = useState<AdminRaceWithRunnerCount[] | false>(
        false,
    );

    const [id, setId] = useState(1);
    const [firstname, setFirstname] = useState("");
    const [lastname, setLastname] = useState("");
    const [gender, setGender] = useState<Gender>(GENDER.M);
    const [birthYear, setBirthYear] = useState(
        (new Date().getFullYear() - 30).toString(),
    );
    const [stopped, setStopped] = useState(false);
    const [raceId, setRaceId] = useStateWithNonNullableSetter<number | null>(
        null,
    );

    const [isSaving, setIsSaving] = useState(false);

    const fetchRaces = useCallback(async () => {
        if (!accessToken) {
            return;
        }

        const result = await getAdminRaces(accessToken);

        if (!isApiRequestResultOk(result)) {
            ToastService.getToastr().error(
                "Impossible de récupérer la liste des courses",
            );
            return;
        }

        const responseRaces = result.json.races;

        if (responseRaces.length < 1) {
            ToastService.getToastr().warning(
                "Aucune course n'a été créée. Au moins une course doit exister pour enregistrer un coureur.",
            );
        }

        setRaces(responseRaces);

        if (raceId === null && responseRaces.length > 0) {
            setRaceId(responseRaces[0].id);
        }
    }, [accessToken, raceId, setRaceId]);

    const onSubmit = useCallback(
        async (e: React.FormEvent) => {
            e.preventDefault();

            if (!accessToken || raceId === null) {
                return;
            }

            setIsSaving(true);

            const body = {
                id,
                firstname,
                lastname,
                gender,
                birthYear: parseInt(birthYear),
                stopped,
                raceId,
            };

            const result = await postAdminRunner(accessToken, body);

            if (!isApiRequestResultOk(result)) {
                ToastService.getToastr().error("Une erreur est survenue");
                setIsSaving(false);
                return;
            }

            ToastService.getToastr().success("Coureur créé");
            navigate(`/admin/runners/${id}`);
        },
        [
            accessToken,
            raceId,
            id,
            firstname,
            lastname,
            gender,
            birthYear,
            stopped,
            navigate,
        ],
    );

    useEffect(() => {
        void fetchRaces();
    }, [fetchRaces]);

    return (
        <Page id="admin-create-runner" title="Créer un coureur">
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

                    <RunnerDetailsForm
                        onSubmit={(e) => {
                            void onSubmit(e);
                        }}
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
                        stopped={stopped}
                        setStopped={setStopped}
                        races={races}
                        raceId={raceId ?? 0}
                        setRaceId={setRaceId}
                        submitButtonDisabled={
                            isSaving || (races && races.length < 1)
                        }
                    />
                </Col>
            </Row>
        </Page>
    );
}
