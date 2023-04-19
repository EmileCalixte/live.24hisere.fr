import {useContext} from "react";
import {userContext} from "../../App";
import {Navigate, Route, Routes} from "react-router-dom";
import FastestLaps from "./FastestLaps";
import AdminHome from "./AdminHome";
import Races from "./races/Races";
import CreateRunner from "./runners/CreateRunner";
import Runners from "./runners/Runners";
import CreateRace from "./races/CreateRace";
import RaceDetails from "./races/RaceDetails";
import CircularLoader from "../../ui/CircularLoader";
import RunnerDetails from "./runners/RunnerDetails";

export default function Admin() {
    const {user} = useContext(userContext);

    if (user === null) {
        return (
            <Navigate to="/"/>
        );
    }

    if (user === undefined) {
        return (
            <CircularLoader/>
        );
    }

    return (
        <Routes>
            <Route path="/" element={<AdminHome/>}/>
            <Route path="runners" element={<Runners/>}/>
            <Route path="runners/create" element={<CreateRunner/>}/>
            <Route path="runners/:runnerId" element={<RunnerDetails/>}/>
            <Route path="races" element={<Races/>}/>
            <Route path="races/create" element={<CreateRace/>}/>
            <Route path="races/:raceId" element={<RaceDetails/>}/>
            <Route path="fastest-laps" element={<FastestLaps/>}/>

            <Route path="*" element={<Navigate to="/admin" replace/>}/>
        </Routes>
    );
}
