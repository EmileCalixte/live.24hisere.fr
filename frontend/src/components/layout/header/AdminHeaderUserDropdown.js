import {app} from "../../App";

const AdminHeaderUserDropdown = () => {
    return (
        <div className="options-dropdown">
            <ul>
                <li>
                    <button onClick={app.logout}>Déconnexion</button>
                </li>
            </ul>
        </div>
    )
}

export default AdminHeaderUserDropdown;
