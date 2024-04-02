import { run } from "node:test";
import React from "react";
import { Col, Row } from "react-bootstrap";
import { getAdminPassages } from "../../../services/api/PassageService";
import { getAdminRaces } from "../../../services/api/RaceService";
import { getAdminRunners } from "../../../services/api/RunnerService";
import ToastService from "../../../services/ToastService";
import type { AdminPassageWithRunnerId } from "../../../types/Passage";
import type { Race } from "../../../types/Race";
import type { Runner } from "../../../types/Runner";
import { isApiRequestResultOk } from "../../../utils/apiUtils";
import { appContext } from "../../App";
import Breadcrumbs from "../../ui/breadcrumbs/Breadcrumbs";
import Crumb from "../../ui/breadcrumbs/Crumb";
import Page from "../../ui/Page";
import LapsStatisticsTable from "../../viewParts/admin/statistics/LapsStatisticsTable";

const RUNNERS_AND_RACES_FETCH_INTERVAL = 60 * 1000;
const PASSAGES_FETCH_INTERVAL = 20 * 1000;

export default function StatisticsAdminView(): React.ReactElement {
    const { accessToken } = React.useContext(appContext).user;

    // false = not fetched yet
    const [passages, setPassages] = React.useState<AdminPassageWithRunnerId[] | false>(false);

    // false = not fetched yet
    const [races, setRaces] = React.useState<Race[] | false>(false);

    // false = not fetched yet
    const [runners, setRunners] = React.useState<Runner[] | false>(false);

    const fetchRaces = React.useCallback(async () => {
        if (!accessToken) {
            return;
        }

        const result = await getAdminRaces(accessToken);

        if (!isApiRequestResultOk(result)) {
            ToastService.getToastr().error("Impossible de récupérer la liste des courses");
            return;
        }

        setRaces(result.json.races);
    }, [accessToken]);

    const fetchRunners = React.useCallback(async () => {
        if (!accessToken) {
            return;
        }

        const result = await getAdminRunners(accessToken);

        if (!isApiRequestResultOk(result)) {
            ToastService.getToastr().error("Impossible de récupérer la liste des coureurs");
            return;
        }

        setRunners(result.json.runners);
    }, [accessToken]);

    const fetchPassages = React.useCallback(async () => {
        if (!accessToken) {
            return;
        }

        const result = await getAdminPassages(accessToken);

        if (!isApiRequestResultOk(result)) {
            ToastService.getToastr().error("Impossible de récupérer la liste des passages");
            return;
        }

        // The passages are already ordered by time
        setPassages(result.json.passages);
    }, [accessToken]);

    React.useEffect(() => {
        void fetchRaces();

        const interval = setInterval(() => { void fetchRaces(); }, RUNNERS_AND_RACES_FETCH_INTERVAL);

        return () => { clearInterval(interval); };
    }, [fetchRaces]);

    React.useEffect(() => {
        void fetchRunners();

        const interval = setInterval(() => { void fetchRunners(); }, RUNNERS_AND_RACES_FETCH_INTERVAL);

        return () => { clearInterval(interval); };
    }, [fetchRunners]);

    React.useEffect(() => {
        void fetchPassages();

        const interval = setInterval(() => { void fetchPassages(); }, PASSAGES_FETCH_INTERVAL);

        return () => { clearInterval(interval); };
    }, [fetchPassages]);

    return (
        <Page id="admin-statistics" title="Statistiques">
            <Row>
                <Col>
                    <Breadcrumbs>
                        <Crumb url="/admin" label="Administration" />
                        <Crumb label="Statistiques" />
                    </Breadcrumbs>
                </Col>
            </Row>

            {races && runners && passages && (
                <Row>
                    <Col>
                        <h2>Nombre de tours</h2>

                        <LapsStatisticsTable races={races}
                                             runners={runners}
                                             passages={passages}
                        />
                    </Col>
                </Row>
            )}
        </Page>
    );
}
