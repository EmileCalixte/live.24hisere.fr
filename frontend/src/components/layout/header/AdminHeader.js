import {app} from "../../App";
import {useState} from "react";
import AdminHeaderUserDropdown from "./AdminHeaderUserDropdown";

const AdminHeader = () => {
    const [userDropdownShown, setUserDropdownShown] = useState(false);

    return(
        <div id="app-header-admin-section">
            <span>
                Vous êtes connecté en tant qu'administrateur.
            </span>
            <div style={{position: 'relative'}}>
                <button className="admin-header-user-button"
                        onClick={() => setUserDropdownShown(!userDropdownShown)}
                >
                    {app.state.user.username}
                    &nbsp;
                    {userDropdownShown &&
                    <i className="fa-solid fa-angle-up"/>
                    }
                    {!userDropdownShown &&
                    <i className="fa-solid fa-angle-down"/>
                    }
                </button>
                {userDropdownShown &&
                <AdminHeaderUserDropdown />
                }
            </div>
        </div>
    )
}

export default AdminHeader;
