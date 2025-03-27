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
import { Table, Td, Th, Tr } from "../../../ui/Table";

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
            <Table className="w-full">
              <thead>
                <Tr>
                  <Th>Nom</Th>
                  <Th>Édition</Th>
                  <Th>Nb. coureurs</Th>
                  <Th>Publique</Th>
                  <Th>Class. simplifié</Th>
                  <Th>Arrêt immédiat</Th>
                  <Th>Date</Th>
                  <Th>Durée</Th>
                  <Th>Distance</Th>
                </Tr>
              </thead>
              <tbody>
                {races.map((race) => {
                  const edition = editions?.find((edition) => edition.id === race.editionId);

                  const lapDistance = parseFloat(race.lapDistance);
                  const initialDistance = parseFloat(race.initialDistance);

                  return (
                    <Tr key={race.id}>
                      <Td>
                        <Link to={`/admin/races/${race.id}`}>{race.name}</Link>
                      </Td>
                      <Td>
                        {edition ? (
                          <Link to={`/admin/editions/${edition.id}`}>{edition.name}</Link>
                        ) : (
                          <CircularLoader />
                        )}
                      </Td>
                      <Td>{race.runnerCount}</Td>
                      <Td>
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
                      </Td>
                      <Td>{race.isBasicRanking ? "Oui" : "Non"}</Td>
                      <Td>{race.isImmediateStop ? "Oui" : "Non"}</Td>
                      <Td>{formatDateAsString(new Date(race.startTime))}</Td>
                      <Td>{formatMsAsDuration(race.duration * 1000)}</Td>
                      <Td>
                        {lapDistance} m{!!initialDistance && <> (dist. initiale {initialDistance} m)</>}
                      </Td>
                    </Tr>
                  );
                })}
              </tbody>
            </Table>
          )}
        </Card>
      )}
    </Page>
  );
}
