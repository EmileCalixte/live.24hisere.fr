import {app} from "../../App";
import {Navigate, Route, Routes} from "react-router-dom";
import AdminHome from "./home/AdminHome";
import Races from "./races/Races";
import Runners from "./runners/Runners";
import RaceSettings from "./race-settings/RaceSettings";

const Admin = () => {
    if (app.state.user === null) {
        return (
            <Navigate to="/" />
        );
    }

    return (
        <Routes>
            <Route exact path="/" element={<AdminHome />} />
            <Route exact path="runners" element={<Runners />} />
            <Route exact path="races" element={<Races />} />
            <Route exact path="race-settings" element={<RaceSettings />} />

            <Route path="*" element={<Navigate to="/admin" replace />} />
        </Routes>
    );
}

export default Admin;
