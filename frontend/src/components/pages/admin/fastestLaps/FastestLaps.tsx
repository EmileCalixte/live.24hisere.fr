import React, {useCallback, useContext, useEffect, useMemo, useState} from "react";
import {AdminPassageWithRunnerId} from "../../../../types/Passage";
import ApiUtil from "../../../../util/ApiUtil";
import {userContext} from "../../../App";
import Breadcrumbs from "../../../layout/breadcrumbs/Breadcrumbs";
import Crumb from "../../../layout/breadcrumbs/Crumb";

type RunnerSortedPassages = {
    [runnerId: number]: AdminPassageWithRunnerId[];
}

const FastestLaps = () => {
    const {accessToken} = useContext(userContext);

    const [passages, setPassages] = useState<AdminPassageWithRunnerId[] | false>(false);

    const fetchPassages = useCallback(async () => {
        const response = await ApiUtil.performAuthenticatedAPIRequest('/admin/passages', accessToken);
        const responseJson = await response.json();

        // The passages are already ordered by time
        setPassages(responseJson.passages);
    }, [accessToken]);

    useEffect(() => {
        fetchPassages();
    }, [fetchPassages]);

    const runnerSortedPassages = useMemo<RunnerSortedPassages | false>(() => {
        if (!passages) {
            return false;
        }

        const sortedPassages: RunnerSortedPassages = {};

        passages.reduce((accumulator, currentValue) => {
            if (currentValue.isHidden) {
                return sortedPassages;
            }

            if (!(currentValue.runnerId in sortedPassages)) {
                sortedPassages[currentValue.runnerId] = [];
            }

            sortedPassages[currentValue.runnerId].push(currentValue);

            return sortedPassages;
        }, sortedPassages);

        return sortedPassages;
    }, [passages]);

    useEffect(() => {
        console.log(runnerSortedPassages);
    }, [runnerSortedPassages]);

    return (
        <div id="page-admin-fastest-laps">
            <div className="row">
                <div className="col-12">
                    <Breadcrumbs>
                        <Crumb url="/admin" label="Administration" />
                        <Crumb label="Tours les plus rapides" />
                    </Breadcrumbs>
                </div>
            </div>
        </div>
    )
}

export default FastestLaps;
