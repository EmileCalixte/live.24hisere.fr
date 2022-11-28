import {app} from "../../App";
import {Navigate, Route, Routes} from "react-router-dom";
import AdminHome from "./home/AdminHome";
import Races from "./races/Races";
import Runners from "./runners/Runners";
import CreateRace from "./races/CreateRace";
import RaceDetails from "./races/RaceDetails";
import CircularLoader from "../../misc/CircularLoader";
import RunnerDetails from "./runners/RunnerDetails";

const Admin = () => {
    if (app.state.user === null) {
        return (
            <Navigate to="/" />
        );
    }

    if (app.state.user === undefined) {
        return (
            <CircularLoader />
        )
    }

    return (
        <Routes>
            <Route path="/" element={<AdminHome />} />
            <Route path="runners" element={<Runners />} />
            <Route path="runners/:runnerId" element={<RunnerDetails />} />
            <Route path="races" element={<Races />} />
            <Route path="races/create" element={<CreateRace />} />
            <Route path="races/:raceId" element={<RaceDetails />} />

            <Route path="*" element={<Navigate to="/admin" replace />} />
        </Routes>
    );
}

export default Admin;
