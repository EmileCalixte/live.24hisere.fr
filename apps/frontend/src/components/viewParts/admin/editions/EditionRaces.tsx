import React from "react";
import { Col, Row } from "react-bootstrap";
import { type AdminRaceWithRunnerCount } from "@live24hisere/core/types";
import { putAdminRaceOrder } from "../../../../services/api/raceService";
import ToastService from "../../../../services/ToastService";
import { type ReactStateSetter } from "../../../../types/utils/react";
import { isApiRequestResultOk } from "../../../../utils/apiUtils";
import { appContext } from "../../../App";
import SortListButtons from "../../../ui/buttons/SortListButtons";
import CircularLoader from "../../../ui/CircularLoader";
import SortList from "../../../ui/lists/SortList";
import RaceListItem from "../races/RaceListItem";

interface EditionRacesProps {
  editionId: number;
  races: AdminRaceWithRunnerCount[] | null | undefined;
  setRaces: ReactStateSetter<AdminRaceWithRunnerCount[] | null | undefined>;
}

export default function EditionRaces({ editionId, races, setRaces }: EditionRacesProps): React.ReactElement {
  const { accessToken } = React.useContext(appContext).user;

  // Used when user is reordering the list
  const [sortingRaces, setSortingRaces] = React.useState<AdminRaceWithRunnerCount[] | false>(false);
  const [isSorting, setIsSorting] = React.useState(false);

  const [isSaving, setIsSaving] = React.useState(false);

  const saveSort = React.useCallback(async () => {
    if (!accessToken || !sortingRaces) {
      return;
    }

    setIsSaving(true);

    const raceIds = sortingRaces.map((race) => race.id);

    const result = await putAdminRaceOrder(accessToken, editionId, raceIds);

    if (!isApiRequestResultOk(result)) {
      ToastService.getToastr().error("Impossible de sauvegarder l'ordre des courses");
      setIsSaving(false);
      return;
    }

    setRaces([...sortingRaces]);

    ToastService.getToastr().success("L'ordre des courses a été modifié");
    setIsSorting(false);
    setIsSaving(false);
  }, [accessToken, editionId, setRaces, sortingRaces]);

  React.useEffect(() => {
    if (!races) {
      return;
    }

    // When user enables/disables sorting mode, reset sortingRaces array with current races order
    setSortingRaces([...races]);
  }, [isSorting, races]);

  return (
    <Row>
      <Col>
        <h3>Courses</h3>

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
                saveSort={() => {
                  void saveSort();
                }}
                disabled={isSaving}
              />

              <Row>
                <Col>
                  <SortList
                    items={sortingRaces || []}
                    keyFunction={(race) => race.id}
                    setItems={setSortingRaces}
                    isSorting={isSorting}
                    className="admin-list"
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
      </Col>
    </Row>
  );
}
