import type React from "react";
import { faPlus } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useGetAdminEditions } from "../../../../hooks/api/requests/admin/editions/useGetAdminEditions";
import { useGetAdminRaces } from "../../../../hooks/api/requests/admin/races/useGetAdminRaces";
import { getRacesBreadcrumbs } from "../../../../services/breadcrumbs/breadcrumbService";
import { formatMsAsDuration } from "../../../../utils/durationUtils";
import { formatDateAsString } from "../../../../utils/utils";
import { Card } from "../../../ui/Card";
import CircularLoader from "../../../ui/CircularLoader";
import { Link } from "../../../ui/Link";
import Page from "../../../ui/Page";

export default function RacesAdminView(): React.ReactElement {
  const getRacesQuery = useGetAdminRaces();
  const races = getRacesQuery.data?.races;

  const getEditionsQuery = useGetAdminEditions();
  const editions = getEditionsQuery.data?.editions;

  return (
    <Page
      id="admin-races"
      htmlTitle="Courses"
      title={
        <span className="flex flex-wrap items-center gap-5">
          Courses
          <> </>
          <span className="text-base">
            <Link variant="button" to="/admin/races/create" icon={<FontAwesomeIcon icon={faPlus} />}>
              Créer
            </Link>
          </span>
        </span>
      }
      breadCrumbs={getRacesBreadcrumbs()}
    >
      {getRacesQuery.isLoading && <CircularLoader />}

      {races && (
        <Card>
          {races.length === 0 && <p>Aucune course</p>}

          {races.length > 0 && (
            <table className="mt-3 table">
              <thead>
                <tr>
                  <th>Nom</th>
                  <th>Édition</th>
                  <th>Nb. coureurs</th>
                  <th>Publique</th>
                  <th>Class. simplifié</th>
                  <th>Arrêt immédiat</th>
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
                      <td>{race.isImmediateStop ? "Oui" : "Non"}</td>
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
        </Card>
      )}
    </Page>
  );
}
