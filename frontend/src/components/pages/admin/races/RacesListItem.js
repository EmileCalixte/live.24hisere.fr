import {Link} from "react-router-dom";

const RacesListItem = ({id, name, runnerCount, isPublic}) => {
    return (
        <li key={id}>
            <Link to={`/admin/races/${id}`}>
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
        </li>
    );
}

export default RacesListItem;
