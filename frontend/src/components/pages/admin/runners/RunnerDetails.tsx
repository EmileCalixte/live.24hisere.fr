import {Navigate, useParams} from "react-router-dom";
import React, {useCallback, useEffect, useMemo, useState} from "react";
import {AdminProcessedPassage} from "../../../../types/Passage";
import ApiUtil from "../../../../util/ApiUtil";
import Util from "../../../../util/Util";
import Breadcrumbs from "../../../layout/breadcrumbs/Breadcrumbs";
import Crumb from "../../../layout/breadcrumbs/Crumb";
import CircularLoader from "../../../misc/CircularLoader";
import {app} from "../../../App";
import {
    Gender,
    RunnerWithAdminPassages,
    RunnerWithAdminProcessedPassages,
} from "../../../../types/Runner";
import RunnerDetailsForm from "./RunnerDetailsForm";
import {RaceWithRunnerCount} from "../../../../types/Race";
import ToastUtil from "../../../../util/ToastUtil";
import RunnerDetailsPassages from "./RunnerDetailsPassages";
import RunnerDetailsUtil from "../../../../util/RunnerDetailsUtil";

const RunnerDetails = () => {
    const {runnerId: urlRunnerId} = useParams();

    const [races, setRaces] = useState<RaceWithRunnerCount[] | false>(false);

    const [runner, setRunner] = useState<RunnerWithAdminProcessedPassages | undefined | null>(undefined);

    const [runnerId, setRunnerId] = useState(0);
    const [runnerFirstname, setRunnerFirstname] = useState("");
    const [runnerLastname, setRunnerLastname] = useState("");
    const [runnerGender, setRunnerGender] = useState(Gender.M);
    const [runnerBirthYear, setRunnerBirthYear] = useState("0");
    const [runnerRaceId, setRunnerRaceId] = useState(0);

    const [isSaving, setIsSaving] = useState(false);

    const [redirectAfterIdUpdate, setRedirectAfterIdUpdate] = useState<number | null>(null)

    const runnerRace = useMemo<RaceWithRunnerCount | null>(() => {
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
        const response = await ApiUtil.performAuthenticatedAPIRequest('/admin/races', app.state.accessToken);
        const responseJson = await response.json();

        setRaces(responseJson.races);
    }, []);

    const fetchRunner = useCallback(async () => {
        const response = await ApiUtil.performAuthenticatedAPIRequest(`/admin/runners/${urlRunnerId}`, app.state.accessToken);

        if (!response.ok) {
            console.error('Failed to fetch runner', await response.json());
            setRunner(null);
            return;
        }

        const responseJson = await response.json();

        const responseRunner = RunnerDetailsUtil.getRunnerWithProcessedPassages(
            responseJson.runner as RunnerWithAdminPassages
        ) as RunnerWithAdminProcessedPassages;

        setRunner(responseRunner);

        setRunnerId(responseRunner.id);
        setRunnerFirstname(responseRunner.firstname);
        setRunnerLastname(responseRunner.lastname);
        setRunnerGender(responseRunner.gender);
        setRunnerBirthYear(responseRunner.birthYear);
        setRunnerRaceId(responseRunner.raceId);
    }, [urlRunnerId]);

    const updatePassageVisiblity = useCallback(async (passage: AdminProcessedPassage, hidden: boolean) => {
        if (!runner) {
            return;
        }

        let confirmMessage: string;

        if (hidden) {
            confirmMessage = `Êtes vous sûr de vouloir masquer le passage n°${passage.id} (${Util.formatDateAsString(passage.processed.lapEndTime)}) ?`
        } else {
            confirmMessage = `Êtes vous sûr de vouloir rendre public le passage n°${passage.id} (${Util.formatDateAsString(passage.processed.lapEndTime)}) ?`
        }

        if (!window.confirm(confirmMessage)) {
            return;
        }

        const response = await ApiUtil.performAuthenticatedAPIRequest(`/admin/runners/${runner.id}/passages/${passage.id}`, app.state.accessToken, {
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
    }, [runner, fetchRunner]);

    const updatePassage = useCallback(async (passage: AdminProcessedPassage, time: Date) => {
        if (!runner) {
            return;
        }

        const response = await ApiUtil.performAuthenticatedAPIRequest(`/admin/runners/${runner.id}/passages/${passage.id}`, app.state.accessToken, {
            method: "PATCH",
            body: JSON.stringify({
                time: Util.formatDateForApi(time),
            }),
        });

        if (!response.ok) {
            ToastUtil.getToastr().error("Une erreur est survenue");
            return;
        }

        ToastUtil.getToastr().success("Le temps de passage a bien été modifié");

        fetchRunner();
    }, [runner, fetchRunner]);

        fetchRunner();
    }, [fetchRunner]);

    const deletePassage = useCallback(async (passage: AdminProcessedPassage) => {
        if (!runner) {
            return;
        }

        let confirmMessage = `Êtes vous sûr de vouloir supprimer le passage n°${passage.id} (${Util.formatDateAsString(passage.processed.lapEndTime)}) ?`;

        if (passage.detectionId !== null) {
            confirmMessage += "\n\nLe passage ayant été importé depuis le système de chronométrage, il sera réimporté si il y est toujours présent.";
        }

        if (!window.confirm(confirmMessage)) {
            return;
        }

        const response = await ApiUtil.performAuthenticatedAPIRequest(`/admin/runners/${runner.id}/passages/${passage.id}`, app.state.accessToken, {
            method: "DELETE"
        });

        if (!response.ok) {
            ToastUtil.getToastr().error("Une erreur est survenue");
            return;
        }

        ToastUtil.getToastr().success("Le passage a été supprimé");

        fetchRunner();
    }, [runner, fetchRunner]);

    useEffect(() => {
        fetchRaces();
    }, [fetchRaces]);

    useEffect(() => {
        fetchRunner();
    }, [fetchRunner]);

    const onSubmit = async (e: React.FormEvent) => {
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

        const response = await ApiUtil.performAuthenticatedAPIRequest(`/admin/runners/${runner.id}`, app.state.accessToken, {
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
    }

    if (runner === null) {
        return (
            <Navigate to="/admin/runners" />
        );
    }

    if (redirectAfterIdUpdate !== null) {
        setTimeout(() => setRedirectAfterIdUpdate(null), 0)
        return (
            <Navigate to={`/admin/runners/${redirectAfterIdUpdate}`} replace={true}/>
        )
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
                                           deletePassage={deletePassage}
                    />
                    }
                </div>
            </div>
            }
        </div>
    )
}

export default RunnerDetails;
