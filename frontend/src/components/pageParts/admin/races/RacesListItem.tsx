import { faEye, faEyeSlash, faGrip, faPersonRunning } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Link } from "react-router-dom";
import React, { useCallback } from "react";
import { type AdminRaceWithRunnerCount } from "../../../../types/Race";
import RaceTimer from "../../RaceTimer";

interface RacesListItemProps {
    race: AdminRaceWithRunnerCount;
    isSorting: boolean;
    isDragged: boolean;
    isDraggedOver: boolean;
}

export default function RacesListItem({ race, isSorting, isDragged, isDraggedOver }: RacesListItemProps): JSX.Element {
    const onClick = useCallback((e: React.MouseEvent<HTMLAnchorElement>) => {
        // Prevent navigation to the clicked race if sorting mode is enabled
        if (isSorting) {
            e.preventDefault();
        }
    }, [isSorting]);

    return (
        <Link to={`/admin/races/${race.id}`}
              onClick={onClick}
              className={`${isDragged ? "dragged" : ""} ${isDraggedOver ? "dragged-over" : ""}`}
        >
            {isSorting &&
                <div className="admin-list-link-drag-icon">
                    <FontAwesomeIcon icon={faGrip} />
                </div>
            }

            <div className="admin-list-link-label">
                {race.name}
            </div>

            <div className="admin-list-link-secondary-icons">
                <div className="admin-list-link-secondary-icon-group">
                    <FontAwesomeIcon icon={faPersonRunning} />
                    {race.runnerCount}
                </div>

                <div className="admin-list-link-secondary-icon-group">
                    {race.isPublic &&
                        <FontAwesomeIcon icon={faEye} />
                    }

                    {!race.isPublic &&
                        <FontAwesomeIcon icon={faEyeSlash} />
                    }
                </div>

                <div className="admin-list-link-secondary-icon-group">
                    <RaceTimer race={race} allowNegative={true} />
                </div>
            </div>
        </Link>
    );
}
