import { Col, Row } from "react-bootstrap";
import { Navigate, useNavigate, useParams } from "react-router-dom";
import React, { useCallback, useContext, useEffect, useMemo, useState } from "react";
import { GENDER } from "../../../../constants/Gender";
import { getAdminRaces } from "../../../../services/api/RaceService";
import {
    deleteAdminRunner,
    deleteAdminRunnerPassage,
    getAdminRunner, patchAdminRunner,
    patchAdminRunnerPassage,
    postAdminRunnerPassage,
} from "../../../../services/api/RunnerService";
import { type Gender } from "../../../../types/Gender";
import { type AdminProcessedPassage } from "../../../../types/Passage";
import { type AdminRaceWithRunnerCount } from "../../../../types/Race";
import { type RunnerWithAdminProcessedPassages, type RunnerWithRace } from "../../../../types/Runner";
import { isApiRequestResultOk } from "../../../../util/apiUtils";
import { formatDateAsString, formatDateForApi } from "../../../../util/utils";
import Breadcrumbs from "../../../ui/breadcrumbs/Breadcrumbs";
import Crumb from "../../../ui/breadcrumbs/Crumb";
import Page from "../../../ui/Page";
import CircularLoader from "../../../ui/CircularLoader";
import { userContext } from "../../../App";
import RunnerDetailsForm from "../../../viewParts/admin/runners/RunnerDetailsForm";
import ToastUtil from "../../../../util/ToastUtil";
import RunnerDetailsPassages from "../../../viewParts/admin/runners/RunnerDetailsPassages";
import { getRunnerProcessedPassages } from "../../../../util/RunnerDetailsUtil";

export default function RunnerDetailsAdminView(): React.ReactElement {
    const navigate = useNavigate();

    const { accessToken } = useContext(userContext);

    const { runnerId: urlRunnerId } = useParams();

    const [races, setRaces] = useState<AdminRaceWithRunnerCount[] | false>(false);

    const [runner, setRunner] = useState<RunnerWithRace & RunnerWithAdminProcessedPassages | undefined | null>(undefined);

    const [runnerId, setRunnerId] = useState(0);
    const [runnerFirstname, setRunnerFirstname] = useState("");
    const [runnerLastname, setRunnerLastname] = useState("");
    const [runnerGender, setRunnerGender] = useState<Gender>(GENDER.M);
    const [runnerBirthYear, setRunnerBirthYear] = useState("0");
    const [runnerRaceId, setRunnerRaceId] = useState(0);

    const [isSaving, setIsSaving] = useState(false);

    const runnerRace = useMemo<AdminRaceWithRunnerCount | null>(() => {
        if (!runner || !races) {
            return null;
        }

        const race = races.find(race => race.id === runner.raceId);

        if (!race) {
            return null;
        }

        return race;
    }, [runner, races]);

    const unsavedChanges = useMemo(() => {
        if (!runner) {
            return false;
        }

        return [
            runnerId === runner.id,
            runnerFirstname === runner.firstname,
            runnerLastname === runner.lastname,
            runnerGender === runner.gender,
            runnerBirthYear === runner.birthYear,
            runnerRaceId === runner.raceId,
        ].includes(false);
    }, [runner, runnerId, runnerFirstname, runnerLastname, runnerGender, runnerBirthYear, runnerRaceId]);

    const fetchRaces = useCallback(async () => {
        if (!accessToken) {
            return;
        }

        const result = await getAdminRaces(accessToken);

        if (!isApiRequestResultOk(result)) {
            ToastUtil.getToastr().error("Impossible de récupérer la liste des courses");
            return;
        }

        setRaces(result.json.races);
    }, [accessToken]);

    const fetchRunner = useCallback(async () => {
        if (!races || !urlRunnerId || !accessToken) {
            return;
        }

        const result = await getAdminRunner(accessToken, urlRunnerId);

        if (!isApiRequestResultOk(result)) {
            ToastUtil.getToastr().error("Impossible de récupérer les détails du coureur");
            setRunner(null);
            return;
        }

        const runner = result.json.runner;

        const race = races.find(race => race.id === runner.raceId);

        if (!race) {
            throw new Error("Runner race not found");
        }

        setRunner({
            ...runner,
            race,
            passages: getRunnerProcessedPassages(runner.passages, race),
        });

        setRunnerId(runner.id);
        setRunnerFirstname(runner.firstname);
        setRunnerLastname(runner.lastname);
        setRunnerGender(runner.gender);
        setRunnerBirthYear(runner.birthYear);
        setRunnerRaceId(runner.raceId);
    }, [accessToken, urlRunnerId, races]);

    const updatePassageVisiblity = useCallback(async (passage: AdminProcessedPassage, hidden: boolean) => {
        if (!runner || !accessToken) {
            return;
        }

        let confirmMessage: string;

        if (hidden) {
            confirmMessage = `Êtes vous sûr de vouloir masquer le passage n°${passage.id} (${formatDateAsString(passage.processed.lapEndTime)}) ?`;
        } else {
            confirmMessage = `Êtes vous sûr de vouloir rendre public le passage n°${passage.id} (${formatDateAsString(passage.processed.lapEndTime)}) ?`;
        }

        if (!window.confirm(confirmMessage)) {
            return;
        }

        const result = await patchAdminRunnerPassage(accessToken, runner.id, passage.id, { isHidden: hidden });

        if (!isApiRequestResultOk(result)) {
            ToastUtil.getToastr().error("Une erreur est survenue");
            return;
        }

        ToastUtil.getToastr().success(hidden ? "Le passage a été masqué" : "Le passage n'est plus masqué");

        void fetchRunner();
    }, [accessToken, runner, fetchRunner]);

    const updatePassage = useCallback(async (passage: AdminProcessedPassage, time: Date) => {
        if (!runner || !accessToken) {
            return;
        }

        const result = await patchAdminRunnerPassage(accessToken, runner.id, passage.id, { time: formatDateForApi(time) });

        if (!isApiRequestResultOk(result)) {
            ToastUtil.getToastr().error("Une erreur est survenue");
            return;
        }

        ToastUtil.getToastr().success("Le temps de passage a bien été modifié");

        void fetchRunner();
    }, [accessToken, runner, fetchRunner]);

    const saveNewPassage = useCallback(async (time: Date) => {
        if (!runner || !accessToken) {
            return;
        }

        const result = await postAdminRunnerPassage(accessToken, runner.id, {
            isHidden: false,
            time: formatDateForApi(time),
        });

        if (!isApiRequestResultOk(result)) {
            ToastUtil.getToastr().error("Une erreur est survenue");
            return;
        }

        ToastUtil.getToastr().success("Le passage a bien été créé");

        void fetchRunner();
    }, [accessToken, runner, fetchRunner]);

    const deletePassage = useCallback(async (passage: AdminProcessedPassage) => {
        if (!runner || !accessToken) {
            return;
        }

        let confirmMessage = `Êtes vous sûr de vouloir supprimer le passage n°${passage.id} (${formatDateAsString(passage.processed.lapEndTime)}) ?`;

        if (passage.detectionId !== null) {
            confirmMessage += "\n\nAttention, le passage ayant été importé depuis le système de chronométrage, il sera réimporté si il y est toujours présent. Préférez masquer le passage plutôt que de le supprimer si vous souhaitez qu'il n'apparaisse plus au public.";
        }

        if (!window.confirm(confirmMessage)) {
            return;
        }

        const result = await deleteAdminRunnerPassage(accessToken, runner.id, passage.id);

        if (!isApiRequestResultOk(result)) {
            ToastUtil.getToastr().error("Une erreur est survenue");
            return;
        }

        ToastUtil.getToastr().success("Le passage a été supprimé");

        void fetchRunner();
    }, [accessToken, runner, fetchRunner]);

    useEffect(() => {
        void fetchRaces();
    }, [fetchRaces]);

    useEffect(() => {
        void fetchRunner();
    }, [fetchRunner]);

    const onSubmit = useCallback(async (e: React.FormEvent) => {
        e.preventDefault();

        if (!runner || !accessToken) {
            return;
        }

        setIsSaving(true);

        const idHasChanged = runnerId !== runner.id;

        const body = {
            id: runnerId,
            firstname: runnerFirstname,
            lastname: runnerLastname,
            birthYear: parseInt(runnerBirthYear),
            gender: runnerGender,
            raceId: runnerRaceId,
        };

        const result = await patchAdminRunner(accessToken, runner.id, body);

        if (!isApiRequestResultOk(result)) {
            ToastUtil.getToastr().error("Une erreur est survenue");
            setIsSaving(false);
            return;
        }

        ToastUtil.getToastr().success("Détails du coureur enregistrés");

        if (idHasChanged) {
            navigate(`/admin/runners/${runnerId}`, { replace: true });
            return;
        } else {
            await fetchRunner();
        }

        setIsSaving(false);
    }, [runner, accessToken, runnerId, runnerFirstname, runnerLastname, runnerBirthYear, runnerGender, runnerRaceId, navigate, fetchRunner]);

    const deleteRunner = useCallback(async () => {
        if (!runner || !accessToken) {
            return;
        }

        if (!window.confirm("Êtes-vous sûr de vouloir supprimer ce coureur ?")) {
            return;
        }

        const result = await deleteAdminRunner(accessToken, runner.id);

        if (!isApiRequestResultOk(result)) {
            ToastUtil.getToastr().error("Une erreur est survenue");
            return;
        }

        ToastUtil.getToastr().success("Coureur supprimé");
        navigate("/admin/runners");
    }, [accessToken, navigate, runner]);

    if (runner === null) {
        return (
            <Navigate to="/admin/runners" />
        );
    }

    return (
        <Page id="admin-runner-details" title={runner === undefined ? "Chargement" : `Détails du coureur ${runner.firstname} ${runner.lastname}`}>
            <Row>
                <Col>
                    <Breadcrumbs>
                        <Crumb url="/admin" label="Administration" />
                        <Crumb url="/admin/runners" label="Coureurs" />
                        {(() => {
                            if (runner === undefined) {
                                return (
                                    <CircularLoader />
                                );
                            }

                            return (
                                <Crumb label={`${runner.lastname.toUpperCase()} ${runner.firstname}`} />
                            );
                        })()}
                    </Breadcrumbs>
                </Col>
            </Row>
            {runner === undefined &&
                <Row>
                    <Col>
                        <CircularLoader />
                    </Col>
                </Row>
            }

            {runner !== undefined &&
                <>
                    <Row>
                        <Col xxl={3} xl={4} lg={6} md={9} sm={12}>
                            <RunnerDetailsForm onSubmit={onSubmit}
                                               id={runnerId}
                                               setId={setRunnerId}
                                               firstname={runnerFirstname}
                                               setFirstname={setRunnerFirstname}
                                               lastname={runnerLastname}
                                               setLastname={setRunnerLastname}
                                               gender={runnerGender}
                                               setGender={setRunnerGender}
                                               birthYear={runnerBirthYear}
                                               setBirthYear={setRunnerBirthYear}
                                               races={races}
                                               raceId={runnerRaceId}
                                               setRaceId={setRunnerRaceId}
                                               submitButtonDisabled={isSaving || !unsavedChanges}
                            />
                        </Col>
                    </Row>

                    <Row>
                        <Col className="mt-3">
                            <h3>Passages</h3>

                            <RunnerDetailsPassages passages={runner.passages}
                                                   runnerRace={runnerRace}
                                                   updatePassageVisiblity={updatePassageVisiblity}
                                                   updatePassage={updatePassage}
                                                   saveNewPassage={saveNewPassage}
                                                   deletePassage={deletePassage}
                            />
                        </Col>
                    </Row>

                    <Row>
                        <Col className="mt-3">
                            <h3>Supprimer le coureur</h3>

                            <p>Tous les passages liés à ce coureur seront également supprimés. Cette action est irréversible.</p>

                            <button className="button red mt-3"
                                    onClick={() => { void deleteRunner(); }}
                            >
                                Supprimer le coureur
                            </button>
                        </Col>
                    </Row>
                </>
            }
        </Page>
    );
}
