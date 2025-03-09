import React from "react";
import { Col, Row } from "react-bootstrap";
import type { AdminRaceWithRunnerCount } from "@live24hisere/core/types";
import type { useGetAdminEditionRaces } from "../../../../hooks/api/requests/admin/races/useGetAdminEditionRaces";
import { usePutAdminRaceOrder } from "../../../../hooks/api/requests/admin/races/usePutAdminRaceOrder";
import SortListButtons from "../../../ui/buttons/SortListButtons";
import CircularLoader from "../../../ui/CircularLoader";
import SortList from "../../../ui/lists/SortList";
import RaceListItem from "../races/RaceListItem";

interface EditionRacesProps {
  editionId: number;
  races: AdminRaceWithRunnerCount[] | null | undefined;
  getRacesQuery: ReturnType<typeof useGetAdminEditionRaces>;
}

export default function EditionRaces({ editionId, races, getRacesQuery }: EditionRacesProps): React.ReactElement {
  const putRaceOrderMutation = usePutAdminRaceOrder(editionId);

  // Used when user is reordering the list
  const [sortingRaces, setSortingRaces] = React.useState<AdminRaceWithRunnerCount[] | false>(false);
  const [isSorting, setIsSorting] = React.useState(false);

  const [isSaving, setIsSaving] = React.useState(false);

  function saveSort(): void {
    if (!sortingRaces) {
      return;
    }

    setIsSaving(true);

    const raceIds = sortingRaces.map((race) => race.id);

    putRaceOrderMutation.mutate(raceIds, {
      onSettled: () => {
        void getRacesQuery.refetch().finally(() => {
          setIsSaving(false);
          setIsSorting(false);
        });
      },
    });
  }

  React.useEffect(() => {
    if (!races) {
      return;
    }

    // When user enables/disables sorting mode, reset sortingRaces array with current races order
    setSortingRaces([...races]);
  }, [isSorting, races]);

  return (
    <>
      <h2>Courses</h2>

      <p>Les courses seront ordonnées dans le même ordre que celui visible ici.</p>

      {(() => {
        if (races === undefined) {
          return <CircularLoader />;
        }

        if (races === null) {
          return <p>Une erreur est survenue lors de la récupération des courses de l'édition</p>;
        }

        if (races.length < 1) {
          return <p>Aucune course dans cette édition</p>;
        }

        return (
          <>
            <SortListButtons
              isSorting={isSorting}
              setIsSorting={setIsSorting}
              saveSort={saveSort}
              disabled={isSaving}
            />

            <Row>
              <Col>
                <SortList
                  items={sortingRaces || []}
                  keyFunction={(race) => race.id}
                  setItems={setSortingRaces}
                  isSorting={isSorting}
                >
                  {(race, isDragged, isDraggedOver) => (
                    <RaceListItem
                      race={race}
                      isSorting={isSorting}
                      isDragged={isDragged}
                      isDraggedOver={isDraggedOver}
                    />
                  )}
                </SortList>
              </Col>
            </Row>
          </>
        );
      })()}
    </>
  );
}
