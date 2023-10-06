import { faAngleDown, faAngleUp } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { userContext } from "../../App";
import React, { useContext, useState } from "react";
import AdminHeaderUserDropdown from "./AdminHeaderUserDropdown";

export default function AdminHeader(): React.ReactElement {
    const { user } = useContext(userContext);

    const [userDropdownShown, setUserDropdownShown] = useState(false);

    const hideUserDropdown = (): void => {
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
            <div style={{ position: "relative" }}>
                <button className="admin-header-user-button"
                        onClick={() => { setUserDropdownShown(!userDropdownShown); }}
                >
                    {user.username}
                    &nbsp;
                    {userDropdownShown &&
                        <FontAwesomeIcon icon={faAngleUp} />
                    }
                    {!userDropdownShown &&
                        <FontAwesomeIcon icon={faAngleDown} />
                    }
                </button>

                {userDropdownShown &&
                    <AdminHeaderUserDropdown hideDropdown={hideUserDropdown} />
                }
            </div>
        </div>
    );
}
