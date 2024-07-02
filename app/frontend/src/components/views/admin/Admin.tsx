import React, { useContext } from "react";
import { appContext } from "../../App";
import { Navigate, Route, Routes } from "react-router-dom";
import DisabledAppAdminView from "./DisabledAppAdminView";
import FastestLapsAdminView from "./FastestLapsAdminView";
import AdminHomeView from "./AdminHomeView";
import PassageImportSettingsAdminView from "./passageImportSettings/PassageImportSettingsAdminView";
import RacesAdminView from "./races/RacesAdminView";
import CreateRunnerAdminView from "./runners/CreateRunnerAdminView";
import ImportRunnersCsvView from "./runners/ImportRunnersCsvView";
import RunnersAdminView from "./runners/RunnersAdminView";
import CreateRaceAdminView from "./races/CreateRaceAdminView";
import RaceDetailsAdminView from "./races/RaceDetailsAdminView";
import CircularLoader from "../../ui/CircularLoader";
import RunnerDetailsAdminView from "./runners/RunnerDetailsAdminView";

export default function Admin(): React.ReactElement {
    const { user } = useContext(appContext).user;

    if (user === null) {
        return (
            <Navigate to="/" />
        );
    }

    if (user === undefined) {
        return (
            <CircularLoader />
        );
    }

    return (
        <Routes>
            <Route path="/" element={<AdminHomeView />} />
            <Route path="runners" element={<RunnersAdminView />} />
            <Route path="runners/create" element={<CreateRunnerAdminView />} />
            <Route path="runners/import-csv" element={<ImportRunnersCsvView />} />
            <Route path="runners/:runnerId" element={<RunnerDetailsAdminView />} />
            <Route path="races" element={<RacesAdminView />} />
            <Route path="races/create" element={<CreateRaceAdminView />} />
            <Route path="races/:raceId" element={<RaceDetailsAdminView />} />
            <Route path="fastest-laps" element={<FastestLapsAdminView />} />
            <Route path="passage-import-settings" element={<PassageImportSettingsAdminView />} />
            <Route path="disabled-app" element={<DisabledAppAdminView />} />

            <Route path="*" element={<Navigate to="/admin" replace />} />
        </Routes>
    );
}
