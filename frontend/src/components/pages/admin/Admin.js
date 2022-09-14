import {app} from "../../App";
import {Navigate, Route, Routes} from "react-router-dom";
import AdminHome from "./AdminHome";
import Runners from "./runners/Runners";

// TODO
// const breadcrumbs = {
//     runners: {
//
//     }
// };

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
            <Route path="*" element={<Navigate to="/admin" replace />} />
        </Routes>
    );
}

export default Admin;
