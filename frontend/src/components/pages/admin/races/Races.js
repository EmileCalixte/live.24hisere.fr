import Breadcrumbs from "../../../layout/breadcrumbs/Breadcrumbs";
import Crumb from "../../../layout/breadcrumbs/Crumb";
import {useCallback, useEffect, useMemo, useState} from "react";
import ApiUtil from "../../../../util/ApiUtil";
import {app} from "../../../App";
import CircularLoader from "../../../misc/CircularLoader";
import {Link} from "react-router-dom";
import RacesListItem from "./RacesListItem";
import ToastUtil from "../../../../util/ToastUtil";

const Races = () => {
    // false = not fetched yet. Once fetched, it's an array
    const [races, setRaces] = useState(false);

    // Used when user is reordering the list
    const [sortingRaces, setSortingRaces] = useState(false);
    const [isSorting, setIsSorting] = useState(false);

    const [isSaving, setIsSaving] = useState(false);

    const fetchRaces = useCallback(async () => {
        const response = await ApiUtil.performAuthenticatedAPIRequest('/admin/races', app.state.accessToken);
        const responseJson = await response.json();

        setRaces(responseJson.races);
        setSortingRaces(responseJson.races);
    }, []);

    useEffect(() => {
        fetchRaces();
    }, [fetchRaces]);

    useEffect(() => {
        if (races === false) {
            return;
        }

        // When user enables/disables sorting mode, reset sortingRaces array with current races order
        setSortingRaces([...races]);
    }, [isSorting, races]);

    const onDragStart = (e, index) => {
        setDragItemIndex(index);
    }

    const onDragEnter = (e, index) => {
        setDragOverIndex(index);
    }

    const onDragEnd = () => {
        handleSort();
    }

    const [dragItemIndex, setDragItemIndex] = useState(null);
    const [dragOverItemIndex, setDragOverIndex] = useState(null);

    const handleSort = useCallback(() => {
        const _races = [...sortingRaces];

        // Remove dragged race for temporary races array
        const draggedRace = _races.splice(dragItemIndex, 1)[0];

        // Insert dragged race in temporary races array at new index
        _races.splice(dragOverItemIndex, 0, draggedRace);

        setDragItemIndex(null);
        setDragOverIndex(null);

        setSortingRaces(_races);
    }, [sortingRaces, dragItemIndex, dragOverItemIndex]);

    const saveSort = useCallback(async () => {
        setIsSaving(true);

        const raceIds = sortingRaces.map(race => race.id);

        const response = await ApiUtil.performAuthenticatedAPIRequest("/admin/races-order", app.state.accessToken, {
            method: "PUT",
            body: JSON.stringify(raceIds)
        });

        if (!response.ok) {
            ToastUtil.getToastr().error("Une erreur est survenue");
            console.error(await response.text());
            setIsSaving(false);
            return;
        }

        setRaces([...sortingRaces]);

        ToastUtil.getToastr().success("L'ordre des courses a été modifié");
        setIsSorting(false);
        setIsSaving(false);
    }, [sortingRaces]);

    const displayedRaces = useMemo(() => {
        return isSorting ? sortingRaces : races;
    }, [isSorting, races, sortingRaces]);

    return (
        <div id="page-admin-races">
            <div className="row">
                <div className="col-12">
                    <Breadcrumbs>
                        <Crumb url="/admin" label="Administration" />
                        <Crumb label="Courses" />
                    </Breadcrumbs>
                </div>
            </div>

            {races === false &&
            <CircularLoader />
            }

            {races !== false &&
            <div className="row">
                <div className="col-12">
                    <Link to="/admin/races/create" className="button">
                        <i className="fa-solid fa-plus mr-2"/>
                        Créer une course
                    </Link>
                </div>

                <div className="col-12">
                    {races.length === 0 &&
                    <p>Aucune course</p>
                    }

                    {races.length > 0 &&
                    <div className="row mt-4">
                        <div className="col-12">
                            {isSorting === false &&
                            <button className="button" onClick={() => setIsSorting(true)}>
                                <i className="fa-solid fa-arrows-up-down mr-2"/>
                                Changer l'ordre
                            </button>
                            }

                            {isSorting === true &&
                            <>
                                <button className="button red mr-2"
                                        onClick={() => setIsSorting(false)}
                                        disabled={isSaving}
                                >
                                    Annuler
                                </button>
                                <button className="button"
                                        onClick={saveSort}
                                        disabled={isSaving}>
                                    <i className="fa-solid fa-check mr-2"/>
                                    Enregistrer
                                </button>
                            </>
                            }

                        </div>

                        <div className="col-12">
                            <ul className="admin-list">
                                {displayedRaces.map((race, index) => {
                                    return (
                                        <li key={race.id}
                                            className={isSorting ? "draggable" : ""}
                                            draggable={isSorting}
                                            onDragStart={isSorting ? e => onDragStart(e, index) : null}
                                            onDragEnter={isSorting ? e => onDragEnter(e, index) : null}
                                            onDragOver={isSorting ? e => e.preventDefault() : null}
                                            onDragEnd={isSorting ? onDragEnd : null}
                                        >
                                            <RacesListItem key={race.id}
                                                           id={race.id}
                                                           name={race.name}
                                                           runnerCount={race.runnerCount}
                                                           isPublic={race.isPublic}
                                                           isSorting={isSorting}
                                                           isDragged={index === dragItemIndex}
                                                           isDraggedOver={index === dragOverItemIndex}
                                            />
                                        </li>
                                    )
                                })}
                            </ul>
                        </div>
                    </div>

                    }
                </div>
            </div>
            }
        </div>
    )
}

export default Races;
