import {Link} from "react-router-dom";
import {useCallback} from "react";

const RacesListItem = ({id, name, runnerCount, isPublic, isSorting}) => {
    const onClick = useCallback((e) => {
        // Prevent navigation to the clicked race if sorting mode is enabled
        if (isSorting) {
            e.preventDefault();
        }
    }, [isSorting])

    return (
        <Link to={`/admin/races/${id}`} onClick={onClick}>
            {isSorting &&
            <div className="admin-list-link-drag-icon">
                <i className="fa-solid fa-grip"/>
            </div>
            }
            <div className="admin-list-link-label">
                {name}
            </div>
            <div className="admin-list-link-secondary-icons">
                <div className="admin-list-link-secondary-icon-group">
                    <i className="fa-solid fa-person-running"/>
                    {runnerCount}
                </div>
                <div className="admin-list-link-secondary-icon-group">
                    {isPublic &&
                    <i className="fa-solid fa-eye"/>
                    }

                    {!isPublic &&
                    <i className="fa-solid fa-eye-slash" style={{color: "#999"}}/>
                    }
                </div>
            </div>
        </Link>
    );
}

export default RacesListItem;
