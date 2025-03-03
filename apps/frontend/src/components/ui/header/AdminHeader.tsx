import type React from "react";
import { useContext, useState } from "react";
import { faAngleDown, faAngleUp } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { appContext } from "../../../contexts/AppContext";
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
    <div
      id="app-header-admin-section"
      className="flex justify-between bg-yellow-500 px-3 py-1 text-neutral-950 md:px-5 dark:bg-yellow-700 dark:text-white"
    >
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
          className="hover:cursor-pointer"
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
