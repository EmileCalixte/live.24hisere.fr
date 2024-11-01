import React, { useCallback, useContext, useEffect, useMemo, useState } from "react";
import { faArrowsUpDown, faCheck, faPlus } from "@fortawesome/free-solid-svg-icons";
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
import CircularLoader from "../../../ui/CircularLoader";
import Page from "../../../ui/Page";
import RacesListItem from "../../../viewParts/admin/races/RacesListItem";

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

  const [dragItemIndex, setDragItemIndex] = useState<number | null>(null);
  const [dragOverItemIndex, setDragOverIndex] = useState<number | null>(null);

  const handleSort = useCallback(() => {
    if (sortingRaces === false) {
      return;
    }

    if (dragItemIndex === null || dragOverItemIndex === null) {
      return;
    }

    const races = [...sortingRaces];

    // Remove dragged race for temporary races array
    const draggedRace = races.splice(dragItemIndex, 1)[0];

    // Insert dragged race in temporary races array at new index
    races.splice(dragOverItemIndex, 0, draggedRace);

    setDragItemIndex(null);
    setDragOverIndex(null);

    setSortingRaces(races);
  }, [sortingRaces, dragItemIndex, dragOverItemIndex]);

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

  const onDragStart = useCallback((e: React.DragEvent, index: number) => {
    setDragItemIndex(index);
  }, []);

  const onDragEnter = useCallback((e: React.DragEvent, index: number) => {
    setDragOverIndex(index);
  }, []);

  const onDragEnd = useCallback(() => {
    handleSort();
  }, [handleSort]);

  const displayedRaces = useMemo(() => {
    return isSorting ? sortingRaces : races;
  }, [isSorting, races, sortingRaces]);

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
                  <Row className="mt-4">
                    <Col>
                      {!isSorting && (
                        <button
                          className="button"
                          onClick={() => {
                            setIsSorting(true);
                          }}
                        >
                          <FontAwesomeIcon icon={faArrowsUpDown} className="me-2" />
                          Changer l'ordre
                        </button>
                      )}

                      {isSorting && (
                        <>
                          <button
                            className="button red me-2"
                            onClick={() => {
                              setIsSorting(false);
                            }}
                            disabled={isSaving}
                          >
                            Annuler
                          </button>
                          <button
                            className="button"
                            onClick={() => {
                              void saveSort();
                            }}
                            disabled={isSaving}
                          >
                            <FontAwesomeIcon icon={faCheck} className="me-2" />
                            Enregistrer
                          </button>
                        </>
                      )}
                    </Col>
                  </Row>

                  <Row>
                    <Col>
                      <ul className="admin-list">
                        {(displayedRaces as AdminRaceWithRunnerCount[]).map((race, index) => {
                          return (
                            <li
                              key={race.id}
                              className={isSorting ? "draggable" : ""}
                              draggable={isSorting}
                              onDragStart={
                                isSorting
                                  ? (e) => {
                                      onDragStart(e, index);
                                    }
                                  : undefined
                              }
                              onDragEnter={
                                isSorting
                                  ? (e) => {
                                      onDragEnter(e, index);
                                    }
                                  : undefined
                              }
                              onDragOver={
                                isSorting
                                  ? (e) => {
                                      e.preventDefault();
                                    }
                                  : undefined
                              }
                              onDragEnd={isSorting ? onDragEnd : undefined}
                            >
                              <RacesListItem
                                key={race.id}
                                race={race}
                                isSorting={isSorting}
                                isDragged={index === dragItemIndex}
                                isDraggedOver={index === dragOverItemIndex}
                              />
                            </li>
                          );
                        })}
                      </ul>
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
