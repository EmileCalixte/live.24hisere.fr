import React from "react";
import { appDataContext } from "../../../contexts/AppDataContext";
import { userContext } from "../../../contexts/UserContext";
import AdminHeaderUserDropdown from "./AdminHeaderUserDropdown";

export default function AdminHeader(): React.ReactElement {
  const { user } = React.useContext(userContext);
  const { isAppEnabled } = React.useContext(appDataContext);

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
      <AdminHeaderUserDropdown user={user} />
    </div>
  );
}
