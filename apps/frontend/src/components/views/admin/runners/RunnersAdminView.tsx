import React, { useCallback, useContext, useEffect, useMemo, useState } from "react";
import { faFileCsv, faPlus } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Col, Row } from "react-bootstrap";
import { Link } from "react-router-dom";
import { type AdminRace, type RaceDict, type Runner } from "@live24hisere/core/types";
import { getAdminRaces } from "../../../../services/api/raceService";
import { getAdminRunners } from "../../../../services/api/runnerService";
import ToastService from "../../../../services/ToastService";
import { isApiRequestResultOk } from "../../../../utils/apiUtils";
import { getRaceDictFromRaces } from "../../../../utils/raceUtils";
import { appContext } from "../../../App";
import Breadcrumbs from "../../../ui/breadcrumbs/Breadcrumbs";
import Crumb from "../../../ui/breadcrumbs/Crumb";
import CircularLoader from "../../../ui/CircularLoader";
import Page from "../../../ui/Page";
import RunnersTable from "../../../viewParts/admin/runners/RunnersTable";

const RACE_SELECT_OPTION_ALL = "all";

export default function RunnersAdminView(): React.ReactElement {
  const { accessToken } = useContext(appContext).user;

  // false = not fetched yet
  const [runners, setRunners] = useState<Runner[] | false>(false);

  // false = not fetched yet
  const [races, setRaces] = useState<RaceDict<AdminRace> | false>(false);

  const [selectedRaceId, setSelectedRaceId] = useState<number | null>(null);

  function onSelectRace(e: React.ChangeEvent<HTMLSelectElement>): void {
    if (e.target.value === RACE_SELECT_OPTION_ALL) {
      setSelectedRaceId(null);
      return;
    }

    setSelectedRaceId(parseInt(e.target.value));
  }

  const fetchRaces = useCallback(async () => {
    if (!accessToken) {
      return;
    }

    const result = await getAdminRaces(accessToken);

    if (!isApiRequestResultOk(result)) {
      ToastService.getToastr().error("Impossible de récupérer la liste des courses");
      return;
    }

    setRaces(getRaceDictFromRaces(result.json.races));
  }, [accessToken]);

  const fetchRunners = useCallback(async () => {
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

  const displayedRunners = useMemo<Runner[] | false>(() => {
    if (!runners) {
      return false;
    }

    if (selectedRaceId === null) {
      return runners;
    }

    return runners.filter((runner) => runner.raceId === selectedRaceId);
  }, [runners, selectedRaceId]);

  useEffect(() => {
    void fetchRaces();
  }, [fetchRaces]);

  useEffect(() => {
    void fetchRunners();
  }, [fetchRunners]);

  return (
    <Page id="admin-runners" title="Coureurs">
      <Row>
        <Col>
          <Breadcrumbs>
            <Crumb url="/admin" label="Administration" />
            <Crumb label="Coureurs" />
          </Breadcrumbs>
        </Col>
      </Row>

      {displayedRunners === false && (
        <Row>
          <Col>
            <CircularLoader />
          </Col>
        </Row>
      )}

      {displayedRunners !== false && (
        <>
          <Row>
            <Col className="d-flex gap-2">
              <Link to="/admin/runners/create" className="button">
                <FontAwesomeIcon icon={faPlus} className="me-2" />
                Ajouter un coureur
              </Link>

              <Link to="/admin/runners/import-csv" className="button">
                <FontAwesomeIcon icon={faFileCsv} className="me-2" />
                Importer via fichier CSV
              </Link>
            </Col>
          </Row>

          <Row>
            <Col lg={3} md={4} sm={6} xs={12} className="mt-3">
              <div className="input-group">
                <label htmlFor="admin-runners-race-select">Course</label>
                <select id="admin-runners-race-select" className="input-select" onChange={onSelectRace}>
                  <option value={RACE_SELECT_OPTION_ALL}>Toutes</option>

                  {(() => {
                    if (races === false) {
                      return <option disabled>Chargement des courses...</option>;
                    }

                    return (
                      <>
                        {Object.entries(races).map(([raceId, race]) => {
                          return (
                            <option key={raceId} value={raceId}>
                              {race.name}
                            </option>
                          );
                        })}
                      </>
                    );
                  })()}
                </select>
              </div>
            </Col>
          </Row>

          <Row>
            <Col className="mt-3">
              {displayedRunners.length === 0 && <p>Aucun coureur</p>}

              {displayedRunners.length > 0 && <RunnersTable runners={displayedRunners} races={races} />}
            </Col>
          </Row>
        </>
      )}
    </Page>
  );
}
