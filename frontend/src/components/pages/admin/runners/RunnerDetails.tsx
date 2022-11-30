import {Navigate, useParams} from "react-router-dom";
import React, {useCallback, useEffect, useMemo, useState} from "react";
import ApiUtil from "../../../../util/ApiUtil";
import Breadcrumbs from "../../../layout/breadcrumbs/Breadcrumbs";
import Crumb from "../../../layout/breadcrumbs/Crumb";
import CircularLoader from "../../../misc/CircularLoader";
import {app} from "../../../App";
import Runner, {Gender} from "../../../../types/Runner";
import RunnerDetailsForm from "./RunnerDetailsForm";
import {RaceWithRunnerCount} from "../../../../types/Race";

const RunnerDetails = () => {
    const {runnerId: urlRunnerId} = useParams();

    const [races, setRaces] = useState<RaceWithRunnerCount[] | false>(false);

    const [runner, setRunner] = useState<Runner | undefined | null>(undefined);

    const [runnerId, setRunnerId] = useState(0);
    const [runnerFirstname, setRunnerFirstname] = useState("");
    const [runnerLastname, setRunnerLastname] = useState("");
    const [runnerGender, setRunnerGender] = useState(Gender.M);
    const [runnerBirthYear, setRunnerBirthYear] = useState("0");
    const [runnerRaceId, setRunnerRaceId] = useState(0);

    const [isSaving, setIsSaving] = useState(false);

    const unsavedChanges = useMemo(() => {
        if (!runner) {
            return false;
        }

        return [
            runnerFirstname === runner.firstname,
            runnerLastname === runner.lastname,
            runnerGender === runner.gender,
            runnerBirthYear === runner.birthYear,
            runnerRaceId === runner.raceId,
        ].includes(false);
    }, [runner, runnerFirstname, runnerLastname, runnerGender, runnerBirthYear, runnerRaceId]);

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

        const responseRunner = responseJson.runner as Runner

        console.log(responseRunner);

        setRunner(responseRunner);

        setRunnerId(responseRunner.id);
        setRunnerFirstname(responseRunner.firstname);
        setRunnerLastname(responseRunner.lastname);
        setRunnerGender(responseRunner.gender);
        setRunnerBirthYear(responseRunner.birthYear);
        setRunnerRaceId(responseRunner.raceId);
    }, [urlRunnerId]);

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

        console.log("TODO");

        // const body = {
        //     firstname: runnerFirstname,
        //     lastname: runnerLastname,
        //     // ...
        // };

        // const response = TODO

        setIsSaving(false);
    }

    if (runner === null) {
        return (
            <Navigate to="/admin/runners" />
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
            <div className="row">
                <div className="col-xl-4 col-lg-6 col-md-9 col-12">
                    {runner === undefined &&
                    <CircularLoader />
                    }

                    {runner !== undefined &&
                    <div className="row">
                        <div className="col-12">
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
                    </div>
                    }
                </div>
            </div>
        </div>
    )
}

export default RunnerDetails;
