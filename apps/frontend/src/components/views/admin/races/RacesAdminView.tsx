import React from "react";
import { faPlus } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Col, Row } from "react-bootstrap";
import { Link } from "react-router-dom";
import type { AdminEditionWithRaceCount, AdminRaceWithRunnerCount } from "@live24hisere/core/types";
import { getAdminEditions } from "../../../../services/api/editionService";
import { getAdminRaces } from "../../../../services/api/raceService";
import { getRacesBreadcrumbs } from "../../../../services/breadcrumbs/breadcrumbService";
import ToastService from "../../../../services/ToastService";
import { isApiRequestResultOk } from "../../../../utils/apiUtils";
import { formatDateAsString, formatMsAsDuration } from "../../../../utils/utils";
import { appContext } from "../../../App";
import CircularLoader from "../../../ui/CircularLoader";
import Page from "../../../ui/Page";

export default function RacesAdminView(): React.ReactElement {
  const { accessToken } = React.useContext(appContext).user;

  // false = not fetched yet
  const [races, setRaces] = React.useState<AdminRaceWithRunnerCount[] | false>(false);
  const [editions, setEditions] = React.useState<AdminEditionWithRaceCount[] | false>(false);

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

  const fetchEditions = React.useCallback(async () => {
    if (!accessToken) {
      return;
    }

    const result = await getAdminEditions(accessToken);

    if (!isApiRequestResultOk(result)) {
      ToastService.getToastr().error("Impossible de récupérer la liste des éditions");
      return;
    }

    setEditions(result.json.editions);
  }, [accessToken]);

  React.useEffect(() => {
    void fetchRaces();
  }, [fetchRaces]);

  React.useEffect(() => {
    void fetchEditions();
  }, [fetchEditions]);

  return (
    <Page id="admin-races" title="Courses">
      <Row>
        <Col>{getRacesBreadcrumbs()}</Col>
      </Row>

      {races === false && <CircularLoader />}

      {races !== false && (
        <>
          <Row>
            <Col>
              <Link to="/admin/races/create" className="button">
                <FontAwesomeIcon icon={faPlus} className="me-2" />
                Créer une course
              </Link>
            </Col>
          </Row>

          <Row>
            <Col>
              {races.length === 0 && <p>Aucune course</p>}

              {races.length > 0 && (
                <table className="table mt-3">
                  <thead>
                    <tr>
                      <th>Nom</th>
                      <th>Édition</th>
                      <th>Nb. coureurs</th>
                      <th>Publique</th>
                      <th>Date</th>
                      <th>Durée</th>
                      <th>Distance</th>
                    </tr>
                  </thead>
                  <tbody>
                    {races.map((race) => {
                      const edition = editions ? editions.find((edition) => edition.id === race.editionId) : undefined;

                      const lapDistance = parseFloat(race.lapDistance);
                      const initialDistance = parseFloat(race.initialDistance);

                      return (
                        <tr key={race.id}>
                          <td>
                            <Link to={`/admin/races/${race.id}`}>{race.name}</Link>
                          </td>
                          <td>
                            {edition ? (
                              <Link to={`/admin/editions/${edition.id}`}>{edition.name}</Link>
                            ) : (
                              <CircularLoader />
                            )}
                          </td>
                          <td>{race.runnerCount}</td>
                          <td>
                            {edition ? (
                              edition.isPublic ? (
                                race.isPublic ? (
                                  "Oui"
                                ) : (
                                  "Non"
                                )
                              ) : (
                                "Non (édition privée)"
                              )
                            ) : (
                              <CircularLoader />
                            )}
                          </td>
                          <td>{formatDateAsString(new Date(race.startTime))}</td>
                          <td>{formatMsAsDuration(race.duration * 1000)}</td>
                          <td>
                            {lapDistance} m{!!initialDistance && <> (dist. initiale {initialDistance} m)</>}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              )}
            </Col>
          </Row>
        </>
      )}
    </Page>
  );
}
