import type React from "react";
import { useContext, useState } from "react";
import { faAngleDown, faAngleUp } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { appContext } from "../../App";
import AdminHeaderUserDropdown from "./AdminHeaderUserDropdown";

export default function AdminHeader(): React.ReactElement {
  const {
    user: { user },
    appData: { isAppEnabled },
  } = useContext(appContext);

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
        {!isAppEnabled && (
          <>
            <> </>
            <strong>Application désactivée</strong>
          </>
        )}
      </span>
      <div style={{ position: "relative" }}>
        <button
          className="admin-header-user-button"
          onClick={() => {
            setUserDropdownShown(!userDropdownShown);
          }}
        >
          {user.username}
          &nbsp;
          {userDropdownShown ? <FontAwesomeIcon icon={faAngleUp} /> : <FontAwesomeIcon icon={faAngleDown} />}
        </button>

        {userDropdownShown && <AdminHeaderUserDropdown hideDropdown={hideUserDropdown} />}
      </div>
    </div>
  );
}
