import React, { useCallback, useContext, useEffect, useState } from "react";
import { faPlus } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Col, Row } from "react-bootstrap";
import { Link } from "react-router-dom";
import { type AdminRaceWithRunnerCount } from "@live24hisere/core/types";
import { getAdminRaces, putAdminRaceOrder } from "../../../../services/api/raceService";
import ToastService from "../../../../services/ToastService";
import { isApiRequestResultOk } from "../../../../utils/apiUtils";
import { appContext } from "../../../App";
import Breadcrumbs from "../../../ui/breadcrumbs/Breadcrumbs";
import Crumb from "../../../ui/breadcrumbs/Crumb";
import SortListButtons from "../../../ui/buttons/SortListButtons";
import CircularLoader from "../../../ui/CircularLoader";
import SortList from "../../../ui/lists/SortList";
import Page from "../../../ui/Page";
import RaceListItem from "../../../viewParts/admin/races/RaceListItem";

export default function RacesAdminView(): React.ReactElement {
  const { accessToken } = useContext(appContext).user;

  // false = not fetched yet
  const [races, setRaces] = useState<AdminRaceWithRunnerCount[] | false>(false);

  // Used when user is reordering the list
  const [sortingRaces, setSortingRaces] = useState<AdminRaceWithRunnerCount[] | false>(false);
  const [isSorting, setIsSorting] = useState(false);

  const [isSaving, setIsSaving] = useState(false);

  const fetchRaces = useCallback(async () => {
    if (!accessToken) {
      return;
    }

    const result = await getAdminRaces(accessToken);

    if (!isApiRequestResultOk(result)) {
      ToastService.getToastr().error("Impossible de récupérer la liste des courses");
      return;
    }

    setRaces(result.json.races);
    setSortingRaces(result.json.races);
  }, [accessToken]);

  const saveSort = useCallback(async () => {
    if (!accessToken || !sortingRaces) {
      return;
    }

    setIsSaving(true);

    const raceIds = sortingRaces.map((race) => race.id);

    const result = await putAdminRaceOrder(accessToken, raceIds);

    if (!isApiRequestResultOk(result)) {
      ToastService.getToastr().error("Impossible de sauvegarder l'ordre des courses");
      setIsSaving(false);
      return;
    }

    setRaces([...sortingRaces]);

    ToastService.getToastr().success("L'ordre des courses a été modifié");
    setIsSorting(false);
    setIsSaving(false);
  }, [accessToken, sortingRaces]);

  useEffect(() => {
    void fetchRaces();
  }, [fetchRaces]);

  useEffect(() => {
    if (races === false) {
      return;
    }

    // When user enables/disables sorting mode, reset sortingRaces array with current races order
    setSortingRaces([...races]);
  }, [isSorting, races]);

  return (
    <Page id="admin-races" title="Courses">
      <Row>
        <Col>
          <Breadcrumbs>
            <Crumb url="/admin" label="Administration" />
            <Crumb label="Courses" />
          </Breadcrumbs>
        </Col>
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
                <>
                  <SortListButtons
                    isSorting={isSorting}
                    setIsSorting={setIsSorting}
                    saveSort={() => {
                      void saveSort();
                    }}
                    disabled={isSaving}
                    className="mt-4"
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
              )}
            </Col>
          </Row>
        </>
      )}
    </Page>
  );
}
