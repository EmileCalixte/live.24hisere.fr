import {userContext} from "../../App";
import {useContext, useState} from "react";
import AdminHeaderUserDropdown from "./AdminHeaderUserDropdown";

const AdminHeader = () => {
    const {user} = useContext(userContext);

    const [userDropdownShown, setUserDropdownShown] = useState(false);

    const hideUserDropdown = () => {
        setUserDropdownShown(false);
    };

    if (!user) {
        throw new Error("User is not defined");
    }

    return (
        <div id="app-header-admin-section">
            <span>
                Vous êtes connecté en tant qu'administrateur.
            </span>
            <div style={{position: "relative"}}>
                <button className="admin-header-user-button"
                        onClick={() => setUserDropdownShown(!userDropdownShown)}
                >
                    {user.username}
                    &nbsp;
                    {userDropdownShown &&
                        <i className="fa-solid fa-angle-up"/>
                    }
                    {!userDropdownShown &&
                        <i className="fa-solid fa-angle-down"/>
                    }
                </button>

                {userDropdownShown &&
                    <AdminHeaderUserDropdown hideDropdown={hideUserDropdown} />
                }
            </div>
        </div>
    );
};

export default AdminHeader;
