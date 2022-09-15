import {Link} from "react-router-dom";

const MenuItem = ({url, label, icon}) => {
    return (
        <li>
            <Link to={url}>
                <div className="admin-home-menu-link-icon">
                    <i className={icon}/>
                </div>
                <div className="admin-home-menu-link-label">
                    {label}
                </div>
            </Link>
        </li>
    )
}

export default MenuItem;
