import {Link} from "react-router-dom";

interface MenuItemProps {
    url: string;
    label: string;
    icon: string;
}

export default function MenuItem({url, label, icon}: MenuItemProps) {
    return (
        <li>
            <Link to={url}>
                <div className="admin-list-link-icon">
                    <i className={icon}/>
                </div>
                <div className="admin-list-link-label">
                    {label}
                </div>
            </Link>
        </li>
    );
}
