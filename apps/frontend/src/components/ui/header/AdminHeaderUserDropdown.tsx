import React from "react";
import { faAngleDown, faAngleUp } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { appContext } from "../../../contexts/AppContext";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "../DropdownMenu";

export default function AdminHeaderUserDropdown(): React.ReactElement {
  const { logout } = React.useContext(appContext).user;

  const [isOpened, setIsOpened] = React.useState(false);

  return (
    <DropdownMenu onOpenChange={setIsOpened}>
      <DropdownMenuTrigger asChild>
        <button className="hover:cursor-pointer">
          Admin
          <> </>
          <FontAwesomeIcon icon={isOpened ? faAngleUp : faAngleDown} />
        </button>
      </DropdownMenuTrigger>

      <DropdownMenuContent>
        <DropdownMenuItem asChild>
          <button onClick={logout}>Déconnexion</button>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
