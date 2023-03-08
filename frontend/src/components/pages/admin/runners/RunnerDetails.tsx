import {Navigate, useParams} from "react-router-dom";
import React, {useCallback, useContext, useEffect, useMemo, useState} from "react";
import {type AdminProcessedPassage} from "../../../../types/Passage";
import {performAuthenticatedAPIRequest} from "../../../../util/apiUtils";
import {formatDateAsString, formatDateForApi} from "../../../../util/utils";
import Breadcrumbs from "../../../layout/breadcrumbs/Breadcrumbs";
import Crumb from "../../../layout/breadcrumbs/Crumb";
import CircularLoader from "../../../misc/CircularLoader";
import {userContext} from "../../../App";
import {
    Gender,
    type RunnerWithAdminPassages,
    type RunnerWithAdminProcessedPassages, type RunnerWithRace,
} from "../../../../types/Runner";
import RunnerDetailsForm from "./RunnerDetailsForm";
import {type AdminRaceWithRunnerCount} from "../../../../types/Race";
import ToastUtil from "../../../../util/ToastUtil";
import RunnerDetailsPassages from "./RunnerDetailsPassages";
import {getRunnerProcessedPassages} from "../../../../util/RunnerDetailsUtil";

const RunnerDetails = () => {
    const {accessToken} = useContext(userContext);

    const {runnerId: urlRunnerId} = useParams();

    const [races, setRaces] = useState<AdminRaceWithRunnerCount[] | false>(false);

    const [runner, setRunner] = useState<RunnerWithRace & RunnerWithAdminProcessedPassages | undefined | null>(undefined);

    const [runnerId, setRunnerId] = useState(0);
    const [runnerFirstname, setRunnerFirstname] = useState("");
    const [runnerLastname, setRunnerLastname] = useState("");
    const [runnerGender, setRunnerGender] = useState(Gender.M);
    const [runnerBirthYear, setRunnerBirthYear] = useState("0");
    const [runnerRaceId, setRunnerRaceId] = useState(0);

    const [isSaving, setIsSaving] = useState(false);

    const [redirectAfterIdUpdate, setRedirectAfterIdUpdate] = useState<number | null>(null);

    const [redirectAfterDelete, setRedirectAfterDelete] = useState(false);

    const runnerRace = useMemo<AdminRaceWithRunnerCount | null>(() => {
        if (!runner || !races) {
            return null;
        }

        if (!(runner.raceId in races)) {
            return null;
        }

        return races[runner.raceId];
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
        const response = await performAuthenticatedAPIRequest("/admin/races", accessToken);
        const responseJson = await response.json();

        setRaces(responseJson.races);
    }, [accessToken]);

    const fetchRunner = useCallback(async () => {
        if (!races) {
            return;
        }

        const response = await performAuthenticatedAPIRequest(`/admin/runners/${urlRunnerId}`, accessToken);

        if (!response.ok) {
            console.error("Failed to fetch runner", await response.json());
            setRunner(null);
            return;
        }

        const responseJson = await response.json();

        const runner = responseJson.runner as RunnerWithAdminPassages;

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
        if (!runner) {
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

        const response = await performAuthenticatedAPIRequest(`/admin/runners/${runner.id}/passages/${passage.id}`, accessToken, {
            method: "PATCH",
            body: JSON.stringify({
                isHidden: hidden,
            }),
        });

        if (!response.ok) {
            ToastUtil.getToastr().error("Une erreur est survenue");
            return;
        }

        ToastUtil.getToastr().success(hidden ? "Le passage a été masqué" : "Le passage n'est plus masqué");

        fetchRunner();
    }, [accessToken, runner, fetchRunner]);

    const updatePassage = useCallback(async (passage: AdminProcessedPassage, time: Date) => {
        if (!runner) {
            return;
        }

        const response = await performAuthenticatedAPIRequest(`/admin/runners/${runner.id}/passages/${passage.id}`, accessToken, {
            method: "PATCH",
            body: JSON.stringify({
                time: formatDateForApi(time),
            }),
        });

        if (!response.ok) {
            ToastUtil.getToastr().error("Une erreur est survenue");
            return;
        }

        ToastUtil.getToastr().success("Le temps de passage a bien été modifié");

        fetchRunner();
    }, [accessToken, runner, fetchRunner]);

    const saveNewPassage = useCallback(async (time: Date) => {
        if (!runner) {
            return;
        }

        const response = await performAuthenticatedAPIRequest(`/admin/runners/${runner.id}/passages`, accessToken, {
            method: "POST",
            body: JSON.stringify({
                isHidden: false,
                time: formatDateForApi(time),
            }),
        });

        if (!response.ok) {
            ToastUtil.getToastr().error("Une erreur est survenue");
            return;
        }

        ToastUtil.getToastr().success("Le passage a bien été créé");

        fetchRunner();
    }, [accessToken, runner, fetchRunner]);

    const deletePassage = useCallback(async (passage: AdminProcessedPassage) => {
        if (!runner) {
            return;
        }

        let confirmMessage = `Êtes vous sûr de vouloir supprimer le passage n°${passage.id} (${formatDateAsString(passage.processed.lapEndTime)}) ?`;

        if (passage.detectionId !== null) {
            confirmMessage += "\n\nLe passage ayant été importé depuis le système de chronométrage, il sera réimporté si il y est toujours présent.";
        }

        if (!window.confirm(confirmMessage)) {
            return;
        }

        const response = await performAuthenticatedAPIRequest(`/admin/runners/${runner.id}/passages/${passage.id}`, accessToken, {
            method: "DELETE",
        });

        if (!response.ok) {
            ToastUtil.getToastr().error("Une erreur est survenue");
            return;
        }

        ToastUtil.getToastr().success("Le passage a été supprimé");

        fetchRunner();
    }, [accessToken, runner, fetchRunner]);

    useEffect(() => {
        fetchRaces();
    }, [fetchRaces]);

    useEffect(() => {
        fetchRunner();
    }, [fetchRunner]);

    const onSubmit = useCallback(async (e: React.FormEvent) => {
        e.preventDefault();

        if (!runner) {
            return;
        }

        setIsSaving(true);

        const idHasChanged = runnerId !== runner.id;

        const body = {
            id: runnerId,
            firstname: runnerFirstname,
            lastname: runnerLastname,
            birthYear: runnerBirthYear,
            gender: runnerGender,
            raceId: runnerRaceId,
        };

        const response = await performAuthenticatedAPIRequest(`/admin/runners/${runner.id}`, accessToken, {
            method: "PATCH",
            body: JSON.stringify(body),
        });

        const responseJson = await response.json();

        if (!response.ok) {
            ToastUtil.getToastr().error("Une erreur est survenue");
            console.error(responseJson);
            setIsSaving(false);
            return;
        }

        ToastUtil.getToastr().success("Détails du coureur enregistrés");

        if (idHasChanged) {
            setRedirectAfterIdUpdate(runnerId);
            setIsSaving(false);
            return;
        } else {
            await fetchRunner();
        }

        setIsSaving(false);
    }, [accessToken, fetchRunner, runner, runnerBirthYear, runnerFirstname, runnerLastname, runnerGender, runnerId, runnerRaceId]);

    const deleteRunner = useCallback(async () => {
        if (!runner) {
            return;
        }

        if (!window.confirm("Êtes-vous sûr de vouloir supprimer ce coureur ?")) {
            return;
        }

        const response = await performAuthenticatedAPIRequest(`/admin/runners/${runner.id}`, accessToken, {
            method: "DELETE",
        });

        if (!response.ok) {
            ToastUtil.getToastr().error("Une erreur est survenue");
            const responseJson = await response.json();
            console.error(responseJson);
            return;
        }

        ToastUtil.getToastr().success("Coureur supprimé");
        setRedirectAfterDelete(true);
    }, [accessToken, runner]);

    if (redirectAfterDelete) {
        return (
            <Navigate to="/admin/runners" />
        );
    }

    if (runner === null) {
        return (
            <Navigate to="/admin/runners" />
        );
    }

    if (redirectAfterIdUpdate !== null) {
        setTimeout(() => setRedirectAfterIdUpdate(null), 0);

        return (
            <Navigate to={`/admin/runners/${redirectAfterIdUpdate}`} replace={true}/>
        );
    }

    return (
        <div id="page-admin-runner-details">
            <div className="row">
                <div className="col-12">
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
                </div>
            </div>
            {runner === undefined &&
                <div className="row">
                    <div className="col-12">
                        <CircularLoader />
                    </div>
                </div>
            }

            {runner !== undefined &&
                <div className="row">
                    <div className="col-xl-4 col-lg-6 col-md-9 col-12">
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
                    </div>

                    <div className="col-12 mt-3">
                        <h3>Passages</h3>

                        {runner.passages.length === 0 &&
                            <p><i>Aucun passage</i></p>
                        }

                        {runner.passages.length > 0 &&
                            <RunnerDetailsPassages passages={runner.passages}
                                                   runnerRace={runnerRace}
                                                   updatePassageVisiblity={updatePassageVisiblity}
                                                   updatePassage={updatePassage}
                                                   saveNewPassage={saveNewPassage}
                                                   deletePassage={deletePassage}
                            />
                        }
                    </div>

                    <div className="col-12 mt-3">
                        <h3>Supprimer le coureur</h3>

                        <p>Cette action est irréversible.</p>

                        <button className="button red mt-3"
                                onClick={deleteRunner}
                        >
                            Supprimer le coureur
                        </button>
                    </div>
                </div>
            }
        </div>
    );
};

export default RunnerDetails;
