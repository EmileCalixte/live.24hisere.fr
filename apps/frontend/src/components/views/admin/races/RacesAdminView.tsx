import type React from "react";
import { faPlus } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Col, Row } from "react-bootstrap";
import { Link } from "react-router-dom";
import { useGetAdminEditions } from "../../../../hooks/api/requests/admin/editions/useGetAdminEditions";
import { useGetAdminRaces } from "../../../../hooks/api/requests/admin/races/useGetAdminRaces";
import { getRacesBreadcrumbs } from "../../../../services/breadcrumbs/breadcrumbService";
import { formatMsAsDuration } from "../../../../utils/durationUtils";
import { formatDateAsString } from "../../../../utils/utils";
import CircularLoader from "../../../ui/CircularLoader";
import Page from "../../../ui/Page";

export default function RacesAdminView(): React.ReactElement {
  const getRacesQuery = useGetAdminRaces();
  const races = getRacesQuery.data?.races;

  const getEditionsQuery = useGetAdminEditions();
  const editions = getEditionsQuery.data?.editions;

  return (
    <Page id="admin-races" title="Courses">
      <Row>
        <Col>{getRacesBreadcrumbs()}</Col>
      </Row>

      {getRacesQuery.isLoading && <CircularLoader />}

      {races && (
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
                      <th>Class. simplifié</th>
                      <th>Date</th>
                      <th>Durée</th>
                      <th>Distance</th>
                    </tr>
                  </thead>
                  <tbody>
                    {races.map((race) => {
                      const edition = editions?.find((edition) => edition.id === race.editionId);

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
                          <td>{race.isBasicRanking ? "Oui" : "Non"}</td>
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
