import {Navigate, useParams} from "react-router-dom";
import {useCallback, useEffect, useState} from "react";
import ApiUtil from "../../../../util/ApiUtil";
import Breadcrumbs from "../../../layout/breadcrumbs/Breadcrumbs";
import Crumb from "../../../layout/breadcrumbs/Crumb";
import CircularLoader from "../../../misc/CircularLoader";
import {app} from "../../../App";
import Runner from "../../../../types/Runner";

const RunnerDetails = () => {
    const {runnerId: urlRunnerId} = useParams();

    const [runner, setRunner] = useState<Runner | undefined | null>(undefined);

    const fetchRunner = useCallback(async () => {
        const response = await ApiUtil.performAuthenticatedAPIRequest(`/admin/runners/${urlRunnerId}`, app.state.accessToken);

        if (!response.ok) {
            console.error('Failed to fetch runner', await response.json());
            setRunner(null);
            return;
        }

        const responseJson = await response.json();

        console.log(responseJson);

        setRunner(responseJson.runner);
    }, [urlRunnerId]);

    useEffect(() => {
        fetchRunner();
    }, [fetchRunner]);

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
                <div className="col-12">
                    {runner === undefined &&
                    <CircularLoader />
                    }

                    {runner !== undefined &&
                    runner.firstname
                    }
                </div>
            </div>
        </div>
    )
}

export default RunnerDetails;
